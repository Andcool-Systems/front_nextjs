"use client";

import Style from "./style.module.css";
import "./style.css"
import { useEffect } from 'react';

function map(val: number, minA: number, maxA: number, minB: number, maxB: number) {
    return minB + ((val - minA) * (maxB - minB)) / (maxA - minA);
}

function Card3D(card, ev) {
    let koef = 1.4;
    let img = card.querySelector('img');
    let imgRect = card.getBoundingClientRect();
    let width = imgRect.width;
    let height = imgRect.height;
    let mouseX = ev.offsetX;
    let mouseY = ev.offsetY;
    let rotateY = map(mouseX, 0, width / koef, -30, 30);
    let rotateX = map(mouseY, 0, height / koef, 30, -30);
    let brightness = map(mouseY, 0, (height / koef) + 50, 1.5, 0.5);
    
    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    img.style.filter = `brightness(${brightness})`;
  }
export default function Main(){
    useEffect(() => {
		var cards = document.querySelectorAll('#a');
        
        cards.forEach((card) => {
        card.addEventListener('mousemove', (ev) => {
            Card3D(card, ev);
        });
        
        card.addEventListener('mouseleave', (ev) => {
            let img = card.querySelector('img');
            
            img.style.transform = 'rotateX(0deg) rotateY(0deg)';
            img.style.filter = 'brightness(1)';
        });
        });
	});
    return (<>
        <div className={Style.card3d} id="a"><img className={Style.img} src="/res/icons/pag.png"></img></div>
        <div className={Style.card3d} id="a"><img className={Style.img} src="/res/icons/clueless.png"></img></div>
        </>);
}