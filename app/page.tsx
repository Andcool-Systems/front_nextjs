"use client";

import { login } from "./script.tsx"
import { useEffect } from 'react';
import Head from 'next/head'
import "./style.css"

export default function Home() {
  useEffect(() => {
    login();
  })
  return (
    <>
      <Head>
        <title>oauth test</title>
      </Head>

      <body>
        <header>
          <div id="card">
              <img id="profile-img" src="/res/icons/steve.png"></img>
              <a id="card-name" href="/login">Войти</a>
          </div>
        </header>
      </body>
    </>
  )
}
