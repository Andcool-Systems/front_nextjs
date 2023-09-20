"use client";

import { login } from "./script.tsx";
import { useEffect } from 'react';

export function Header(){
    useEffect(() => {
        login();
    })

    return (
    <>
    
        <title>oauth test</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link rel="stylesheet" href="/res/header/style.css"></link>
    
          <body>
            <header>
                <img></img>
              <div id="card">
                  <img id="profile-img" src="/res/icons/steve.png"></img>
                  <a id="card-name" href="/login/">Войти</a>
              </div>
            </header>
          </body>
    </>
    )
}