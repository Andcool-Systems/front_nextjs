import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { moveToPage } from "./pages"
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from 'react-query';
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

function getCookiee(name: string) {
    return getCookie(name);
}

async function getNewTokens(reftoken: string){
    if (String(reftoken) == "undefined") return false;
    if (!checkAccess(reftoken)) return false;

    var url = api + "/refreshTokens"
    var data = await axios.post(url, {
        "refreshToken": reftoken
        }, {headers: {"Content-type": "application/json; charset=UTF-8"}}
    );
    var obj = data.data;
    
    if (obj["status"] == "success"){
        setCookiee("accessToken", obj["accessToken"]);
        setCookiee("refreshToken", obj["refreshToken"]);
        return true;       
    }
    else{
        return false;
    }
        
}


var api = process.env.NEXT_PUBLIC_API_URL
export async function login() {
    if (String(getCookiee("accessToken")) != "undefined"){
        if (checkAccess(String(getCookiee("accessToken")))){
            var url = api + "/login"
            var data = await axios.post(url, {},
                {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookiee("accessToken")}}
            );
            var obj = data.data;
            if (obj["status"] == "success"){
                const cardname = document.querySelector("#card-name") as Element;
                const cardnameid = document.getElementById("card-name") as HTMLAnchorElement;
                const hrefimg = document.getElementById("href-img") as HTMLAnchorElement;
                //if (cardname == null) location.reload();
			    cardname.textContent = obj["nickname"];
                cardnameid.href = "/user/" + obj["nickname"] + "/";
                hrefimg.href = "/user/" + obj["nickname"] + "/";
                var avatar = document.getElementById("profile-img") as HTMLImageElement;
                avatar.src = "https://visage.surgeplay.com/face/48/" + obj["uuid"] + "?no=shadow,overlay,ears,cape";
                console.log("logged!");
            }
            
            else{
                console.log(obj);
                if (obj["errorId"] == 4){
                    //moveToPage("/login/");
                }
                if (obj["errorId"] == 2){
                    var res = await getNewTokens(String(getCookiee("refreshToken")));
                    if (!res) console.log(2); //moveToPage("/login/"); 
                    else{
                        setTimeout(() => login(), 1000);
                    }          
                }
            }      
        }else{
            var res = await getNewTokens(String(getCookiee("refreshToken")));
            if (!res) console.log(1); //moveToPage("/login/");
            else{
                setTimeout(() => login(), 1000);
            }
        }
    }else{
        var res = await getNewTokens(String(getCookiee("refreshToken")));
        if (!res) if (window.location.pathname != "/") console.log(3); //moveToPage("/login/");
        else{
            setTimeout(() => login(), 1000);
        } 
    }
}


