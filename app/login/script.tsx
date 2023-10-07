import axios from 'axios';
import { moveToPage } from "./pages"

export function setCookiee(c_name: string, value: string)
{
    var c_value=escape(value) + "; path=/";
    document.cookie=c_name + "=" + c_value;
}

var api = process.env.NEXT_PUBLIC_API_URL
export async function loginUsername(redirect_url: string) {

    var nick = document.getElementById("nick") as HTMLInputElement;
    var url = "https://api.minetools.eu/uuid/" + nick.value;
    var data = await axios.get(url);
    var obj = data.data;
    var uuid = obj["id"];
    var password = document.getElementById("password") as HTMLInputElement;
    if (uuid != "" && password.value != "" && obj["status"] != "ERR"){

        var url = api + "/loginUsername"
        var data = await axios.post(url, {
            "uuid": uuid,
            "password": password.value
            }, {headers: {"Content-type": "application/json; charset=UTF-8"}}
        );
        var obj = data.data;
        console.log(obj);
        if (obj["status"] == "success"){
            setCookiee("accessToken", obj["accessToken"]);
            setCookiee("refreshToken", obj["refreshToken"]);
            setTimeout(() => moveToPage(redirect_url), 100); 
        }
        else{
            if (obj["errorId"] == 1){
                const usr = document.querySelector("#nickSmall") as Element;
                usr.textContent = "Имя пользователя не найдено";
            }
            if (obj["errorId"] == 6){
                const usr = document.querySelector("#passwordSmall") as Element;
                usr.textContent = "Неправильный пароль";
            }
        }
            
        
    }
}


