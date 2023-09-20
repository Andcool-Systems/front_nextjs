import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { moveToPage } from "./pages"

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

function delete_cookie(name: string) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
			    cardname.textContent = obj["nickname"];
                cardnameid.href = "/me/";
                var avatar = document.getElementById("profile-img") as HTMLImageElement;
                avatar.src = "https://crafatar.com/avatars/" + obj["uuid"] + "?size=46&overlay";

                document.title = obj["nickname"] + " · личный кабнет";
                let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
                if (!link) {
                    link = document.createElement('link') as HTMLLinkElement;
                    link.rel = 'icon';
                    document.head.appendChild(link);
                }
                link.href = "https://crafatar.com/avatars/" + obj["uuid"] + "?size=46&overlay";
                console.log("logged!");
            }
            
            else{
                if (obj["message"] == "invalid refresh token"){
                    moveToPage("/login/");
                }
                if (obj["message"] == "acces token overdated"){
                    var res = await getNewTokens(String(getCookiee("refreshToken")));
                    if (!res) moveToPage("/login/");
                    else{
                        setTimeout(() => login(), 1000);
                    }          
                }
            }      
        }else{
            var res = await getNewTokens(String(getCookiee("refreshToken")));
            if (!res) moveToPage("/login/");
            else{
                setTimeout(() => login(), 1000);
            }
        }
    }else{
        var res = await getNewTokens(String(getCookiee("refreshToken")));
        if (!res) moveToPage("/login/");
        else{
            setTimeout(() => login(), 1000);
        } 
    }
}

export async function logout() {
    if (String(getCookiee("accessToken")) != "undefined"){
        if (checkAccess(String(getCookiee("accessToken")))){

            var url = api + "/logout"
            var data = await axios.post(url, {},
                {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookiee("accessToken")}}
            );
            var obj = data.data;
            console.log(obj);
            if (obj["status"] == "success"){
                delete_cookie("accessToken");
                delete_cookie("refreshToken");
                moveToPage("/");
                console.log("logged out!");
            }
            
            else{
                if (obj["message"] == "invalid refresh token"){
                    moveToPage("/login/");
                }
                if (obj["message"] == "acces token overdated"){
                    var res = await getNewTokens(String(getCookiee("refreshToken")));
                    if (!res) moveToPage("/login/");
                    else{
                        setTimeout(() => login(), 1000);
                    }          
                }
            }      
        }else{
            var res = await getNewTokens(String(getCookiee("refreshToken")));
            if (!res) moveToPage("/login/");
            else{
                setTimeout(() => login(), 1000);
            }
        }
    }else{
        var res = await getNewTokens(String(getCookiee("refreshToken")));
        if (!res) moveToPage("/login/");
        else{
            setTimeout(() => login(), 1000);
        } 
    }
}

function start(){login()};
start();