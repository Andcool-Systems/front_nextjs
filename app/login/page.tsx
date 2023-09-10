"use client";
import Script from "next/script"
import {register, loginUsername, login } from "./script.tsx"
import {updpass, updnick} from "./events.tsx"


export default function Home() {
  return (
    <>

        <title>oauth test</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="stylesheet" href="res/login/style.css"></link>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      

        <div id="main">
            <h2>Войти</h2>
            <input type="nick" id="nick" name="nick" placeholder="Никнейм майнкрафт" onInput={ updnick }></input>
            <a className="small_mess id" id="nickSmallid"></a>
            <a className="small_mess" id="nickSmall">Введите свой никнейм</a>
            <input type="password" id="password" name="password" placeholder="Пароль" onInput={ updpass }></input>
            <a className="small_mess" id="passwordSmall">Введите пароль</a>

            <div id="buttons">
                <button onClick={ loginUsername }>Войти</button>
                <button onClick={ register }>Зарегистрироваться</button>
            </div>
                
        </div>
    
    </>
  )
}
