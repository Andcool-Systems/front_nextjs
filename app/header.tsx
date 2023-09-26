"use client";

import { login } from "./script.tsx";
import { useEffect } from 'react';
import styles from "./styles/header/style.module.css";

export function Header(){
    useEffect(() => {
        login();
    })

    return (
    <>
    
        <title>oauth test</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <header className={styles.header}>
                <img></img>
              <div id="card" className={styles.card}>
                  <a href="/login/" id="href-img"><img id="profile-img" className={styles.profile_img} src="https://visage.surgeplay.com/face/56/X-Steve?no=shadow,overlay,ears,cape"></img></a>
                  <a id="card-name" href="/login/" className={styles.card_name}>Войти</a>
              </div>
            </header>
          
    </>
    )
}