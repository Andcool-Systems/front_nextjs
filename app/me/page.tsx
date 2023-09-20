"use client";
import Script from "next/script"
import { useEffect } from 'react';
import {login, logout} from "./script.tsx"
import { Header } from '../header.tsx'
import { HydrationProvider, Server, Client } from "react-hydration-provider";

export default function Home() {
    useEffect(() => {
        login();
      });
    return (
    <>
    <HydrationProvider>
        <Client>
            <title>Личный кабинет</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <link rel="stylesheet" href="res/me/style.css"></link>


            <body>
                <header>
                    <img></img>
                    <div id="card">
                        <img id="profile-img" src="/res/icons/steve.png"></img>
                        <a id="card-name" href="/login/">Войти</a>
                    </div>
                </header>
                <button id="logout" onClick={ logout }>Выйти</button>
            </body>
            </Client>
        </HydrationProvider>
    </>
    )
}
