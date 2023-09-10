var loginFlag = false;
import axios from 'axios';

export function updpass(){

    var username = document.getElementById("password") as HTMLInputElement | null;
        
    if (username.value != ""){
        const usr = document.querySelector("#passwordSmall");
        usr.textContent = "";
    }else{
        const usr = document.querySelector("#passwordSmall");
        usr.textContent = "Введите пароль";
    }
}
    
export function updnick(){
    var nick = document.getElementById("nick") as HTMLInputElement | null;
    if (nick.value != ""){
        const nickn = document.querySelector("#nickSmall");
        nickn.textContent = "";
    }else{
        const nickn = document.querySelector("#nickSmall");
        nickn.textContent = "Введите свой никнейм";
    }
    if (loginFlag == false){
        const form = document.getElementById("nick");
        form.addEventListener("focusout", (event) => {
            parseNick();
        });
        loginFlag = true;
    }

}

async function parseNick(){
    var nick = document.getElementById("nick") as HTMLInputElement | null;
    var url = "https://api.minetools.eu/uuid/" + nick.value;
    var data = await axios.get(url);
    var obj = data.data;
    const nickid = document.querySelector("#nickSmallid");
    const nickn = document.querySelector("#nickSmall");
    console.log(obj);
    if (obj["status"] == "ERR") nickn.textContent = "Никнейм не найден";
    else nickid.textContent = "uuid: " + obj["id"];
}