"use client";
let currentPage = 0;
import Script from "next/script"
import {register, loginUsername, login } from "./script.tsx"
//import {updpass, updnick} from "./events"
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../styles/login/style.module.css";
import "../styles/login/style.css"

var loginFlag = false;
export default function Home() {
  const [startVal, setStartVal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState(false);
  function updpass(){
    var username = document.getElementById("password") as HTMLInputElement;
        
    if (username.value != ""){
        const usr = document.querySelector("#passwordSmall") as Element;
        usr.textContent = "";
    }else{
        const usr = document.querySelector("#passwordSmall") as Element;
        usr.textContent = "Введите пароль";
    }
  }
      
  function updnick(){
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
                let namemcResponse = (await axios.get("https://api.namemc.com/server/play.pepeland.net/likes?profile=" + obj["id"])).data
                setStartVal(namemcResponse);
                setUser(obj);
                const namemcStart = document.querySelector("#start-value") as Element;
                namemcStart.textContent = namemcResponse ? "лайк установлен" : "лайк не установлен"
                const namemcNow = document.querySelector("#value-namemc") as Element;
                namemcNow.textContent = namemcResponse ? "Для продолжения снимите его" : "Для продолжения поставьте лайк"

          }else{nickn.textContent = "Никнейм не найден";}
  }

  async function checkRegistr(){
    let response = (await axios.get("https://api.namemc.com/server/play.pepeland.net/likes?profile=" + user["id"])).data;
    const status = document.getElementById("statusVerify");
    
    if (!startVal == response) {
        console.log("verified!"); 
        setVerified(true);
        status.style.color = "green";
        status.textContent = "Подтверждён"
    }
    else {
        console.log("no"); 
        setVerified(false);
        status.style.color = "red";
        status.textContent = "Не подтверждён"
    }
  }

  function updNickOnChange(){
    const status = document.getElementById("statusVerify");
    status.style.color = "red";
    status.textContent = "Не подтверждён"
    setVerified(false);
    const RegMess = document.getElementById("reg_appl");
    RegMess.style.display = "none";
  }
  function showAlert(){
    var nick = document.getElementById("nick") as HTMLInputElement;
      if (nick.value != "" && user["status"] != "ERR"){
        document.getElementById("reg_appl").style.display = "block"
      }
  }
  return (
    <>

        <title>oauth test</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>

            <div id="main" className={styles.main}>
                <h2>Войти</h2>
                <input className={styles.input} type="nick" id="nick" name="nick" placeholder="Никнейм майнкрафт" onInput={ updnick } onChange={ updNickOnChange }></input>
                <a className={styles.small_mess_id} id="nickSmallid"></a>
                <a className={styles.small_mess} id="nickSmall">Введите свой никнейм</a>
                <input className={styles.input} type="password" id="password" name="password" placeholder="Пароль" onInput={ updpass }></input>
                <a className={styles.small_mess} id="passwordSmall">Введите пароль</a>
                <div id="reg_appl" className={styles.reg_appl}>
                    <h2>Подтверждение</h2>
                    <p>Теперь нам нужно понять, что Вы - владелец этого аккаунта. <br/> 
                    Для этого Вам нужно иметь подтверждённую учётную запись на сайте <strong>namemc.com</strong><br/><br/>
                    Для подтверждения, перейдите на сайт <a href="https://ru.namemc.com/server/play.pepeland.net" target="_blank" className={styles.whi}>namemc.com</a>.<br/>
                    Теперь, Вам нужно поставить лайк на сервер Пепеленд, или снимите его, если он уже стоит. 
                    (После успешной регистрации Вы можете вернуть всё обратно)<br/></p>Сейчас <a className={styles.whi} id="start-value"></a><br/>
                    <a id="value-namemc" className={styles.whi}></a><br/>
                    <a className={styles.whi}>Статус: </a><a id="statusVerify">Не подтверждён</a><br/>
                    <button className={styles.button} onClick={ checkRegistr } id="verify_butt">Проверить</button>
                </div>

                <div id="buttons" className={styles.buttons}>
                    <button onClick={ loginUsername } className={styles.button}>Войти</button>
                    <button onClick={ verified ? () => register(user) : showAlert} className={styles.button}>Зарегистрироваться</button>
                </div>
                
                    
            </div>
    
    </>
  )
}
