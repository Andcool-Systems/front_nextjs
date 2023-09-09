import FingerprintJS from '@fingerprintjs/fingerprintjs'

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null)
                                 ? "" : "; expires="+exdate.toUTCString())
                                + "; path=/";
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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

async function getNewTokens(reftoken){
    if (String(reftoken) == "undefined") return false;
    if (!checkAccess(reftoken)) return false;
    const fpPromise = FingerprintJS.load()
            
    const fp = await fpPromise
    const result = await fp.get()
              
    var fingerprint = result.visitorId

    var url = api + "/refreshTokens"
    var data = await axios.post(url, {
        "refreshToken": reftoken,
        "fingerprint": fingerprint
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
function moveToPage(page_url){
    const protocol = window.location.protocol;
    const host = window.location.host;
    window.location.replace(protocol + "//" + host + page_url);
}

var api = "http://192.168.0.105:8080"
export async function login() {
    if (String(getCookie("accessToken")) != "undefined"){
        if (checkAccess(String(getCookie("accessToken")))){
            const fpPromise = FingerprintJS.load()
            
            const fp = await fpPromise
            const result = await fp.get()
              
            var fingerprint = result.visitorId

            var url = api + "/login"
            var data = await axios.post(url, {
                "fingerprint": fingerprint
                }, {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookie("accessToken")}}
            );
            var obj = data.data;
            if (obj["status"] == "success"){

                

                var url = "https://api.minetools.eu/profile/" + obj["username"];
                var data = await axios.get(url);
                var objd = data.data;
                

                document.title = objd["decoded"]["profileName"] + " · личный кабнет";
                var link = document.querySelector("link[rel~='icon']");
                link.href = "https://crafatar.com/avatars/" + obj["username"] + "?size=46&overlay";
                console.log("logged!");
            }
            
            else{
                if (obj["message"] == "invalid refresh token"){
                    moveToPage("/login/");
                }
                if (obj["message"] == "acces token overdated"){
                    var res = await getNewTokens(String(getCookie("refreshToken")));
                    if (!res) moveToPage("/login/");
                    else{
                        setTimeout(login(), 1000);
                    }          
                }
            }      
        }else{
            var res = await getNewTokens(String(getCookie("refreshToken")));
            if (!res) moveToPage("/login/");
            else{
                setTimeout(login(), 1000);
            }
        }
    }else{
        var res = await getNewTokens(String(getCookie("refreshToken")));
        if (!res) moveToPage("/login/");
        else{
            setTimeout(login(), 1000);
        } 
    }
}

export async function logout() {
    if (String(getCookie("accessToken")) != "undefined"){
        if (checkAccess(String(getCookie("accessToken")))){
            const fpPromise = FingerprintJS.load()
            
            const fp = await fpPromise
            const result = await fp.get()
                    
            var fingerprint = result.visitorId
            console.log(fingerprint);
            var url = api + "/logout"
            var data = await axios.post(url, {
                "fingerprint": fingerprint
                }, {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookie("accessToken")}}
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
                    var res = await getNewTokens(String(getCookie("refreshToken")));
                    if (!res) moveToPage("/login/");
                    else{
                        setTimeout(login(), 1000);
                    }          
                }
            }      
        }else{
            var res = await getNewTokens(String(getCookie("refreshToken")));
            if (!res) moveToPage("/login/");
            else{
                setTimeout(login(), 1000);
            }
        }
    }else{
        var res = await getNewTokens(String(getCookie("refreshToken")));
        if (!res) moveToPage("/login/");
        else{
            setTimeout(login(), 1000);
        } 
    }
}

function start(){login()};
start();