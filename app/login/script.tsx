import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/router'
import { moveToPage } from "./pages"

function setCookiee(c_name, value)
{
    var c_value=escape(value) + "; path=/";
    document.cookie=c_name + "=" + c_value;
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
function checkAccess(token) {
    var secondsSinceEpoch = Date.now() / 1000
    var res = parseJwt(token);
    
    return parseInt(res["ExpiresAt"]) > secondsSinceEpoch;
}

function getCookiee(name: string) {
    return getCookie(name);
}

async function getNewTokens(reftoken){
    if (String(reftoken) == "undefined") return false;
    if (!checkAccess(reftoken)) return false;

    var url = api + "/refreshTokens"
    var data = await axios.post(url, {
        "refreshToken": reftoken
        }, {headers: {"Content-type": "application/json; charset=UTF-8"}}
    );
    var obj = data.data;
    
    if (obj["status"] == "success"){
        setCookie("accessToken", obj["accessToken"]);
        setCookie("refreshToken", obj["refreshToken"]);
        return true;       
    }
    else{
        return false;
    }
        
}


var api = "http://192.168.0.105:8080"
export async function register() {
    var nick = document.getElementById("nick") as HTMLInputElement | null;
    var url = "https://api.minetools.eu/uuid/" + nick.value;
    var data = await axios.get(url);
    var obj = data.data;
    var username = obj["id"];
    var password = document.getElementById("password") as HTMLInputElement | null;
    if (username != "" && password.value != ""){

        var url = api + "/register"
        var data = await axios.post(url, {
            "username": username,
            "password": password.value
            }, {headers: {"Content-type": "application/json; charset=UTF-8"}}
        );
        var obj = data.data;
        if (obj["status"] == "success"){
            setCookie("accessToken", obj["accessToken"]);
            setCookie("refreshToken", obj["refreshToken"]);
            setTimeout(() => moveToPage("/"), 1000); 
        }
        else{
            if (obj["message"] == "this user already exists"){
                const usr = document.querySelector("#nickSmall");
                usr.textContent = "Имя пользователя уже существует";
            }
        }
            
        
    }
}

export async function loginUsername() {
    var nick = document.getElementById("nick") as HTMLInputElement | null;
    var url = "https://api.minetools.eu/uuid/" + nick.value;
    var data = await axios.get(url);
    var obj = data.data;
    var username = obj["id"];
    var password = document.getElementById("password") as HTMLInputElement | null;
    if (username != "" && password.value != ""){

        var url = api + "/loginUsername"
        var data = await axios.post(url, {
            "username": username,
            "password": password.value
            }, {headers: {"Content-type": "application/json; charset=UTF-8"}}
        );
        var obj = data.data;
        console.log(obj);
        if (obj["status"] == "success"){
            setCookiee("accessToken", obj["accessToken"]);
            setCookiee("refreshToken", obj["refreshToken"]);
            setTimeout(() => moveToPage("/"), 1000); 
        }
        else{
            if (obj["message"] == "this user already exists"){
                const usr = document.querySelector("#nickSmall");
                usr.textContent = "Имя пользователя уже существует";
            }
            if (obj["message"] == "user not found"){
                const usr = document.querySelector("#nickSmall");
                usr.textContent = "Имя пользователя не найдено";
            }
            if (obj["message"] == "wrong password"){
                const usr = document.querySelector("#passwordSmall");
                usr.textContent = "Не правильный пароль";
            }
        }
            
        
    }
}

export async function login() {
    console.log("trying to login with access token");
    if (String(getCookie("accessToken")) != "undefined"){
        if (checkAccess(String(getCookie("accessToken")))){

            var url = api + "/login"
            var data = await axios.post(url, {},
                {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookie("accessToken")}}
            );
            var obj = data.data;
            if (obj["status"] == "success"){
                setTimeout(() => moveToPage("/"), 1000);        
            }
            else{
                if (obj["message"] == "invalid refresh token"){
                    console.log("invalid refresh token");
                }
                if (obj["message"] == "acces token overdated"){
                    var res = await getNewTokens(String(getCookie("refreshToken")));
                    if (!res) console.log("to login page");
                    else{
                        setTimeout(() => login(), 1000);
                    }          
                }
            }      
        }else{
            var res = await getNewTokens(String(getCookie("refreshToken")));
            if (!res) console.log("to login page");
            else{
                setTimeout(() =>login(), 1000);
            }
        }
    }else{
        var res = await getNewTokens(String(getCookie("refreshToken")));
        if (!res) console.log("to login page");
        else{
            setTimeout(() => login(), 1000);
        } 
    }
}

