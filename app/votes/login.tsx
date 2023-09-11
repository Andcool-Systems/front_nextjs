import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
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
        setCookiee("accessToken", obj["accessToken"]);
        setCookiee("refreshToken", obj["refreshToken"]);
        return true;       
    }
    else{
        return false;
    }
        
}


var api = "http://192.168.0.105:8080"
export async function login() {
    if (String(getCookiee("accessToken")) != "undefined"){
        if (checkAccess(String(getCookiee("accessToken")))){

            var url = api + "/login"
            var data = await axios.post(url, {}, {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookiee("accessToken")}}
            );
            var obj = data.data;
            if (obj["status"] == "success"){
                var url = "https://api.minetools.eu/profile/" + obj["username"];
                var data = await axios.get(url);
                var objd = data.data;
            
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
        if (!res) console.log("to login page");
        else{
            setTimeout(() => login(), 1000);
        } 
    }
}

export async function loadVotes(){
    if (String(getCookiee("accessToken")) != "undefined"){
        if (checkAccess(String(getCookiee("accessToken")))){

            var url = api + "/votes"
            var data = await axios.get(url, {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookiee("accessToken")
                }}
            );
            var obj = data.data;
            return obj;
        }else{
            var res = await getNewTokens(String(getCookiee("refreshToken")));
            if (!res) moveToPage("/login/");
            else{
                setTimeout(() => login(), 1000);
            }
        }
    }else{
        var res = await getNewTokens(String(getCookiee("refreshToken")));
        if (!res) console.log("to login page");
        else{
            setTimeout(() => login(), 1000);
        } 
    }
}


