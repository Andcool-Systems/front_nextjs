"use client";
import { moveToPage } from '../pages';
import { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        moveToPage("/");
      });
    return (<>
    <body>
    <style jsx>{`
        body {
            background-color: #222831;
            font-family: 'Manrope', sans-serif;
            margin: 0%;
            height: 100%;
        }

      `}</style>
    </body>
    </>);
}