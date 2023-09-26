"use client";
import { useEffect } from 'react';
import React from 'react';
import { Header } from './header.tsx'
import "./styles/main/style.css"

export default function Home() {
  "use client";
  
  return (
    <>

    <title>oauth test</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <Header />
    </>
  )
}
