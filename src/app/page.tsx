"use client";
import { login } from "./script.tsx"
import { useEffect } from 'react';


export default function Home() {
  "use client";
  useEffect(() => {
    login();
  })
  return (
    <>

    <title>oauth test</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <link rel="stylesheet" href="res/main/style.css"></link>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>


      <body>
        <header>
          <div id="card">
              <img id="profile-img" src="res/icons/steve.png"></img>
              <a id="card-name" href="/login/">Войти</a>
          </div>
        </header>
      </body>
    </>
  )
}
