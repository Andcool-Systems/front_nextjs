"use client";
import Script from "next/script"
import {login, logout} from "./script.js"

export default function Home() {
    
  return (
    <>

    <title>oauth test</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <link rel="stylesheet" href="res/me/style.css"></link>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>


      <body>
        <header>
            <button id="logout" onClick={ logout }>Выйти</button>
        </header>
      </body>
      
    </>
  )
}
