var loginFlag = false;
import axios from 'axios';

export function updpass(){

    var username = document.getElementById("password") as HTMLInputElement;
        
    if (username.value != ""){
        const usr = document.querySelector("#passwordSmall") as Element;
        usr.textContent = "";
    }else{
        const usr = document.querySelector("#passwordSmall") as Element;
        usr.textContent = "Введите пароль";
    }
}
    
export function updnick(){
    var nick = document.getElementById("nick") as HTMLInputElement;
    if (nick.value != ""){
        const nickn = document.querySelector("#nickSmall") as Element;
        nickn.textContent = "";
    }else{
        const nickn = document.querySelector("#nickSmall") as Element;
        nickn.textContent = "Введите свой никнейм";
    }
    if (loginFlag == false){
        const form = document.getElementById("nick") as Element;
        form.addEventListener("focusout", (event) => {
            parseNick();
        });
        loginFlag = true;
    }

}

async function parseNick(){
    var nick = document.getElementById("nick") as HTMLInputElement;
    var url = "https://api.minetools.eu/uuid/" + nick.value;
    var data = await axios.get(url);
    var obj = data.data;
    const nickid = document.querySelector("#nickSmallid") as Element;
    const nickn = document.querySelector("#nickSmall") as Element;
    console.log(obj);
    if (obj["status"] == "ERR"){
        nickn.textContent = "Никнейм не найден";
        nickid.textContent = "";
    }
    else 
        if (obj["name"] != undefined){
            nick.value = obj["name"];
            nickid.textContent = "uuid: " + obj["id"];
        }else{nickn.textContent = "Никнейм не найден";}
}