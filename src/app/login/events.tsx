var loginFlag = false;
export function updpass(){
    var username = document.getElementById("password").value;
        
    if (username != ""){
        const usr = document.querySelector("#passwordSmall");
        usr.textContent = "";
    }else{
        const usr = document.querySelector("#passwordSmall");
        usr.textContent = "Введите пароль";
    }
}
    
export function updnick(){
    var nick = document.getElementById("nick").value;
    if (nick != ""){
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
    var nick = document.getElementById("nick").value;
    var url = "https://api.minetools.eu/uuid/" + nick;
    var data = await axios.get(url);
    var obj = data.data;
    const nickid = document.querySelector("#nickSmallid");
    const nickn = document.querySelector("#nickSmall");
    console.log(obj);
    if (obj["status"] == "ERR") nickn.textContent = "Никнейм не найден";
    else nickid.textContent = "uuid: " + obj["id"];
}