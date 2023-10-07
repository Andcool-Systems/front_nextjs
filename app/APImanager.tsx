import {Mutex, MutexInterface, Semaphore, SemaphoreInterface, withTimeout} from 'async-mutex';
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { moveToPage } from "./pages"


var api = process.env.NEXT_PUBLIC_API_URL

export const authApi = axios.create({
    baseURL: api,
    withCredentials: false
});

authApi.defaults.headers.common['Content-Type'] = 'application/json';

function setCookiee(c_name: string, value: string)
{
    var c_value=escape(value) + "; path=/";
    document.cookie=c_name + "=" + c_value;
}

function parseJwt (token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function checkAccess(token: string) {
    var secondsSinceEpoch = Date.now() / 1000
    var res = parseJwt(token);
    return parseInt(res["ExpiresAt"]) > secondsSinceEpoch;
}


async function getNewTokens(){
    const refApi = axios.create({baseURL: api, withCredentials: false});

    let refresh = getCookie("refreshToken");
    if (!refresh || !checkAccess(refresh)) return false;
    try{
        var url = api + "/refreshTokens"
        var data = await refApi.post(url, {
            "refreshToken": refresh
            }, {headers: {"Content-type": "application/json; charset=UTF-8"}}
        );
        var obj = data.data;
        
        if (obj["status"] == "success"){
            setCookiee("accessToken", obj["accessToken"]);
            setCookiee("refreshToken", obj["refreshToken"]);
            return obj;  
        } else{
            return obj;
        }   
    }catch (error) {return false;}
    
       
}
export function returnToLogin(){
    if (window.location.pathname != "/"){
        let query = window.location.pathname
        moveToPage("/login?redirect_url=" + query);
    } 
}
const tokenMutex = new Mutex();

authApi.interceptors.request.use(async (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken){
        const tokenExpires = checkAccess(accessToken);
        if (!tokenExpires){
            try{
                const release = await tokenMutex.acquire();
                try{
                    const currentAccess = getCookie("accessToken");
                    if (currentAccess != accessToken) {config.headers["Authorization"] = `Bearer ${currentAccess}`}
                    else{
                        const newAccess = await getNewTokens();
                        if (newAccess != false) {
                            config.headers["Authorization"] = `Bearer ${newAccess['accessToken']}`;
                            if (newAccess["status"] == "error"){/*if (newAccess["errorId"] == 4) returnToLogin();*/}
                        }else{/*returnToLogin();*/}
                    }
                } finally {
                    release();
                }
            } catch (error) {}
        } else {config.headers["Authorization"] = `Bearer ${accessToken}`}
    }else{
        try{
            const newAccess = await getNewTokens();
            if (newAccess != false) {
                config.headers["Authorization"] = `Bearer ${newAccess['accessToken']}`;
                if (newAccess["status"] == "error"){/*if (newAccess["errorId"] == 4) returnToLogin();*/}
            }else{returnToLogin();}
        }catch (error) {}
    }
    return config;
});

authApi.interceptors.response.use((response) => {
        return response;
    },
    async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status == 401 && !originalRequest._retry){
        originalRequest._retry = true;
        const release = await tokenMutex.acquire();
        const accessToken = getCookie("accessToken");
        try{
            const currentAccess = getCookie("accessToken");
            if (currentAccess != accessToken) {authApi.defaults.headers.common["Authorization"] = `Bearer ${currentAccess}`}
            else{
                const newAccess = await getNewTokens();
                if (newAccess != false){
                    authApi.defaults.headers.common["Authorization"] = `Bearer ${newAccess['accessToken']}`;
                    if (newAccess["status"] == "error"){if (newAccess["errorId"] == 4) returnToLogin();}
                }else{returnToLogin();}
            }
            
        } finally {
            release();
        }
        return authApi(originalRequest);
    }else if (error?.response?.status == 403 || error?.response?.status == 400 || error?.response?.status == 404){
        returnToLogin();
    }
    return Promise.reject(error);
})