"use client";
let currentPage = 0;
import Script from "next/script"
import {loginUsername, login, setCookiee } from "./script.tsx"
//import {updpass, updnick} from "./events"
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../styles/login/style.module.css";
import "../styles/login/style.css"
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { moveToPage } from "./pages"


var loginFlag = false;
var loginFlagCode = false;
var api = process.env.NEXT_PUBLIC_API_URL
var lastSuccess = {};
function containsOnlySpaces(str) {
    return str.trim().length === 0;
  }
export default function Home() {
  //const [lastSuccess, setLastSuccess] = useState({});

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

  function updpasscode(){
    var username = document.getElementById("passwordCode") as HTMLInputElement;
        
    if (username.value != ""){
        const usr = document.querySelector("#passwordSmallcode") as Element;
        usr.textContent = "";
    }else{
        const usr = document.querySelector("#passwordSmallcode") as Element;
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

  function updcode(){
    var nick = document.getElementById("code") as HTMLInputElement;
    if (nick.value != ""){
        const nickn = document.querySelector("#codeSmall") as Element;
        nickn.textContent = "";
    }else{
        const nickn = document.querySelector("#codeSmall") as Element;
        nickn.textContent = "Введите код";
    }
    if (loginFlagCode == false){
        const form = document.getElementById("code") as Element;
        form.addEventListener("focusout", (event) => {
            parseCode();
        });
        loginFlagCode = true;
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
                //setStartVal(namemcResponse);
                //setUser(obj);

          }else{nickn.textContent = "Никнейм не найден";}
  }

  async function parseCode(){
    const nickn = document.querySelector("#codeSmall") as Element;
    let code = document.getElementById("code") as HTMLInputElement;
    if (!containsOnlySpaces(code.value)){
        let url = api + "/auth/v2/token/" + code.value;
        let data = await axios.get(url);
        if (data.data["status"] == "success"){
            //console.log(data.data);
            lastSuccess = data.data;
            console.log(lastSuccess);
            const card = document.getElementById("card");
            card.style.display = "flex";
            (document.getElementById("profile-img") as HTMLImageElement).src = "https://visage.surgeplay.com/face/56/" + data.data["response"]["uuid"] + "?no=shadow,overlay,ears,cape"
        }else{
            nickn.textContent = data.data["message"];
        }
    }
}
    async function register(){
        var pass = document.getElementById("passwordCode") as HTMLInputElement;
        if (!containsOnlySpaces(pass.value) && lastSuccess["status"] == "success"){
            let url = api + "/auth/v2/register";
            let data = await axios.post(url, {"password": pass.value, "token": lastSuccess["response"]["token"]});
            if (data.data["status"] == "success"){
                setCookiee("accessToken", data.data["accessToken"]);
                setCookiee("refreshToken", data.data["refreshToken"]);
                setTimeout(() => moveToPage("/"), 1000); 
            }
            else{
                const errmess = document.querySelector("#registerError") as Element;
                errmess.textContent = data.data["message"];
                console.log(data.data["message"]);
            }
        }
    }
  

  const AccordionItem = ({ header, ...rest }) => (
    <Item
      {...rest}
      header={
        <>
          {header}
          <img className={styles.chevron} src="/res/icons/arrow.png" alt="Chevron Down" />
        </>
      }
      className={styles.item}
      buttonProps={{
        className: ({ isEnter }) =>
          `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`
      }}
      contentProps={{ className: styles.itemContent }}
      panelProps={{ className: styles.itemPanel }}
    />
  );
  return (
    <>
        <title>oauth test</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <div className={styles.accordion}>
        <Accordion transition transitionTimeout={250}>
            <AccordionItem header="Войти" initialEntered>
                <div className={styles.child}>
                    <h2 className={styles.h2}>Войти</h2>
                    <input className={styles.input} type="nick" id="nick" name="nick" placeholder="Никнейм майнкрафт" onInput={ updnick }></input>
                    <div className={styles.small_div_id}><a className={styles.small_mess_id} id="nickSmallid"></a></div>
                    <a className={styles.small_mess} id="nickSmall">Введите свой никнейм</a>
                    <input className={styles.input} type="password" id="password" name="password" placeholder="Пароль" onInput={ updpass }></input>
                    <a className={styles.small_mess} id="passwordSmall">Введите пароль</a>
                    
                    
                    <button onClick={ loginUsername } className={styles.button}>Войти</button>
                </div>
            </AccordionItem>
            <AccordionItem header="Зарегистрироваться">
                <div className={styles.child}>
                    <h2 className={styles.h2}>Зарегистрироваться</h2>
                    <h4 className={styles.h4}>Для получения кода, зайдите на Майнкрафт сервер <a onClick={() => {navigator.clipboard.writeText("auth.mc-oauth.com"); alert("Скопировано!")}} className={styles.server}>auth.mc-oauth.com</a> и получите там код</h4>
                    <div className={styles.card} id="card">
                        <img id="profile-img" className={styles.profile_img} src = "https://visage.surgeplay.com/face/56/1420c63cb1114453993fb3479ba1d4c6?no=shadow,overlay,ears,cape"></img>
                        <div className={styles.profile_name_div}>
                            <a id="card-name" className={styles.card_name}>AndcoolSystems</a>
                            <a id="card-uuid" className={styles.card_uuid}>1420c63cb1114453993fb3479ba1d4c6</a>
                        </div>
                    </div>
                    <input className={styles.input} type="number" id="code" name="code" placeholder="Код" onInput={ updcode }></input>
                    <div className={styles.small_div_id}><a className={styles.small_mess_id} id="codeSmallid"></a></div>
                    <a className={styles.small_mess} id="codeSmall">Введите код</a>
                    <input className={styles.input} type="password" id="passwordCode" name="passwordCode" placeholder="Пароль" onInput={ updpasscode }></input>
                    <a className={styles.small_mess} id="passwordSmallcode">Введите пароль</a>
                    
                    <a className={styles.small_mess} id="registerError"></a>
                    <button onClick={() => register()} className={styles.button}>Зарегистрироваться</button>
                </div>
            </AccordionItem>
            
        </Accordion>
    </div>
    </>
  )
}
