"use client";

import Script from "next/script"
import { DetailedHTMLProps, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useEffect } from 'react';
import { loadUser, logout, parseJwt } from "./script.tsx"
import { moveToPage } from "../../pages.js";
import axios, { AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import { Header } from '../../header.tsx'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from 'react-query';

import styles from "../../styles/user/user/style.module.css";
import achstyles from "../../styles/user/user/achievements.module.css";
import "../../styles/login/style.css"
import { authApi, returnToLogin } from "../../APImanager.tsx"
import { Tooltip } from "../../modules/tooltip";
import Style from "../../styles/tooltip.module.css";

const queryClient = new QueryClient();

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

export default function Home({ params }: { params: { name: string } }) {
    useEffect(() => {
        //login();
      });
    return (
    <>
    <title>{params.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <QueryClientProvider client={queryClient}>
        
        <HydrationProvider>
            <Client>
                  <Header/>
				  <ToastContainer
					position="top-right"
					autoClose={2000}
					hideProgressBar={true}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss={false}
					draggable={false}
					pauseOnHover
					theme="dark"
					/>
                  <DynamicForm id={params.name}/>
                </Client>
        </HydrationProvider>
    </QueryClientProvider>
    </>
    )
}
var api = process.env.NEXT_PUBLIC_API_URL
async function ban(id: number){
	console.log("ban");
	let url = api + "/ban"
	let answer = await axios.post(url, {
		"user_id": id
	}, {headers: {"Content-type": "application/json; charset=UTF-8", 
			"Authorization": "Bearer " + getCookie("accessToken")}}
	);
	if (String(answer.data["status"]) == "success"){
		toast.success(answer.data["message"], {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined,
			theme: "dark",
			});
		let pardonbutt = document.getElementById("pardonbtn");
		let butt = document.getElementById("banbtn");
		pardonbutt.style.display = "none";
		butt.style.display = "block";


	}
	else if (String(answer.data["status"]) == "error"){
		toast.error(answer.data["message"], {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined,
			theme: "dark",
			});
	}
	
    
}
async function pardon(id: number){
	console.log("pardon");
	let url = api + "/pardon"
	let answer = await axios.post(url, {
		"user_id": id
	}, {headers: {"Content-type": "application/json; charset=UTF-8", 
			"Authorization": "Bearer " + getCookie("accessToken")}}
	);
	if (String(answer.data["status"]) == "success"){
		toast.success(answer.data["message"], {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined,
			theme: "dark",
			});
		
		let pardonbutt = document.getElementById("pardonbtn");
		let butt = document.getElementById("banbtn");
		pardonbutt.style.display = "block";
		butt.style.display = "none";
	}
	else if (String(answer.data["status"]) == "error"){
		toast.error(answer.data["message"], {
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined,
			theme: "dark",
			});
	}

    
}
async function getUser(id){
	let response = (await authApi.get("/user/" + id)).data;
	return response;
}
function DynamicForm({id}){
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
    const {data, isLoading, isError} = useQuery(['votes', id], () => (getUser(id)));
      
      if (isLoading || isError || !data) return (
          <div className={styles.load}>
              <img className={styles.img} src="/res/icons/logo.png"></img>
              </div>
          );
        
    if (isError || !data) {
		return (
		
        <div className={styles.load}>
          <img className={styles.img} src="/res/icons/logo.png"></img>
          </div>
        );
	}
        
    if (data.status == "error") {return <div id="load"><p>{data.message}</p></div>};

    const votes = (data.votes).map((vote: { id: Key; name: string; info: string; votedNum: string}) =>
      <div key={vote.id}>
        <div id="field" className={styles.field}>
          <a id="name" className={styles.name} href={"/votes/" + vote.id}>{vote.name}</a>
          <p id="info" className={styles.info}>{vote.info}</p>
          <p id="voted" className={styles.voted}>{vote.votedNum}</p>
        </div>
        <hr className={styles.hr}></hr>
      </div>
    );
    
    const root = (
        <div id="root" className={styles.root}>
            <hr className={styles.self_hr}></hr>
            <h3 className={styles.h3}>Настройки аккаунта:</h3>
            <button onClick={ logout } className={styles.logout_button}>Выйти</button>
            <hr className={styles.self_hr}></hr>
        </div>
    );
    
    document.title = data.nickname + ' · ' + (data.self ? "личный кабинет" : "профиль игрока");
    var link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
        var link = document.createElement('link') as HTMLLinkElement;
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = "https://visage.surgeplay.com/face/56/" + data.uuid + "?no=shadow,overlay,ears,cape";

    let perms = parseJwt(getCookie("accessToken")).permissions;
    let moder = (
        <>	
			<h3 style={{marginTop: "0%", marginBottom: "1%"}} className={styles.h3}>Действия модератора:</h3>
            <button id="banbtn" className={styles.banbtn} onClick={() => pardon(data.id)} style={data.banned ? {display: "block"} : {display: "none"}}>Разбанить</button>
			<button id="pardonbtn" className={styles.banbtn} onClick={() => ban(data.id)} style={data.banned ? {display: "none"} : {display: "block"}}>Забанить!</button>
            <hr className={styles.self_hr}></hr>
        </>
    )
	let achievements = (data.achievements).map(achievement =>(
        <div key={achievement.id}>
          	<Tooltip body={<>
				<h3 className={Style.h3}>{achievement.name}</h3>
				{achievement.id != "5" ?
				<>
					<p className={Style.p}>{achievement.info}</p>
					<p className={Style.p}>Это достижение есть у {achievement.perscent}% человек</p> 
				</>: 
				<video autoPlay loop className={Style.video}>
 					<source src="/res/video/rick.mp4"></source>
				</video>
				}
                </>}>
				<div className={achstyles.card3d} id="a">
					<img className={achstyles.img} 
						src={"/res/icons/achievementsIcons/" + achievement.icon + ".png"}></img>
				</div>
          	</Tooltip>

        </div>
    ));
	let lastLoginColor = {color: "#EEEEEE"};
	if (data.lastLogin == "Онлайн") lastLoginColor = {color: "#64c94c"}
	console.log(data.achievements.length);
    return (
		
      <div className={styles.user}>
        {perms == "moderator" && !data.self && !data.moderator ? moder : ""}
        <div className={styles.card}>
            <img className={styles.profile_imgg} src={"https://visage.surgeplay.com/face/64/" + data.uuid + "?no=shadow,overlay,ears,cape"}></img>
            <div className={styles.card_namee}>
                <div className={styles.nn}>
                  	<h2 className={styles.nickname}>{data.nickname}</h2>
                  	{data.badge != "" ? <Tooltip body={<>
                        <h3 className={Style.h3}>{data.badgeInfo}</h3>
                    </>}
              ><img className={styles.badge} src={"/res/badges/" + data.badge + ".png"}></img></Tooltip> : ""}
                </div>
                <p className={styles.uuid}>UUID: {data.uuid_dashed}</p>
                <p className={styles.uuid}>User id: {data.id}</p>
            </div>
          
        </div>
        <hr className={styles.self_hr}></hr>

		<h4 className={styles.h4} style={lastLoginColor}>{data.lastLogin}</h4>
		<h4 className={styles.h4}>Аккаунт создан {data.createdAt}</h4>
		
		{data.achievements.length != 0 && <>
			<hr className={styles.self_hr}></hr>
			<h3 className={achstyles.ach_р3}>Ачивки:</h3>
			<div className={achstyles.ach_container}>
				{achievements}
			</div></>}

        {data.self ? root : <hr className={styles.self_hr}></hr>}
        {(data.votes).length != 0 ? 
        <>

          	<h3>Голосования игрока:</h3>
          	<div className={styles.votes_scrollable}>
		  		<hr className={styles.hr}></hr>
              	{votes}
          	</div>
        	</>
        : ""}
      </div>
    );
  
  }