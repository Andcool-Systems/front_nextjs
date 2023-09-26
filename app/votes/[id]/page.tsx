"use client";

import { useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';
import Link from 'next/link';
import { Header } from '../../header.tsx'
import { useState } from 'react';
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';
import { moveToPage } from "../../pages.js"
import { loadVote, parseJwt } from "./login.tsx"
import { ru_voted } from "./ru_voted.tsx"
import styles from "../../styles/votes/vote/style.module.css";
import "../../styles/votes/vote/style.css"
 

const queryClient = new QueryClient();

export default function Home({ params }: { params: { id: string } }) {

    return (
		<>
		<title>Votes</title>
    	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    	<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
		<QueryClientProvider client={queryClient}>
            <Header />
            <HydrationProvider>
                <Client>
                    <DynamicForm id={params.id}/>
                </Client>
            </HydrationProvider>
		</QueryClientProvider>
		</>
	  );
}

var api = process.env.NEXT_PUBLIC_API_URL
async function vote(){
	
    let ele = document.getElementsByName('vote') as NodeListOf<HTMLInputElement>;
    
    let select = -1;
    for (let i = 0; i < ele.length; i++) {
        if (ele[i].checked) select = parseInt(ele[i].value);
    }
    var notifier = document.getElementById("notifier") as HTMLInputElement;
    if (select == -1){
        notifier.style.display = "block";
        notifier.textContent = "Пожалуйста, выберите вариант ответа выше"
    }else{
        notifier.style.display = "none";
        notifier.textContent = "";

        let url = api + "/vote"
        let answer = await axios.post(url, {
                "field_id": select
                
            }, {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookie("accessToken")}}
            );
        if (String(answer.data["status"]) == "success"){
            console.log(":");
            location.reload();
        }else{
            notifier.style.display = "block";
            notifier.textContent = answer.data["message"];
        }
    }
}

async function unvote(id: number){

  var notifier = document.getElementById("notifier") as HTMLInputElement;

      //notifier.style.display = "block";
      //notifier.textContent = "Пожалуйста, выберите вариант ответа выше"

      //notifier.style.display = "none";
      //notifier.textContent = "";

      let url = api + "/unvote"
      let answer = await axios.post(url, {
              "vote_id": id
              
          }, {headers: {"Content-type": "application/json; charset=UTF-8", 
              "Authorization": "Bearer " + getCookie("accessToken")}}
          );
      if (String(answer.data["status"]) == "success"){
          location.reload();
      }else{
          notifier.style.display = "block";
          notifier.textContent = answer.data["message"];
      }
  
}

async function deleteVote(id: number){
    let confirmation = confirm("Точно? Отменить это действие будет невозможно!");

    if (confirmation){
        let url = api + "/deleteVote"
        let answer = await axios.post(url, {
            "vote_id": id
        }, {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookie("accessToken")}}
        );
        if (String(answer.data["status"]) == "success"){
            moveToPage("/votes/");
        }
        else if (String(answer.data["status"]) == "error"){
            alert(answer.data["message"]);
        }
    }
	
    
}
async function pin(id: number){


    if (true){
        let url = api + "/pin"
        let answer = await axios.post(url, {
            "vote_id": id
        }, {headers: {"Content-type": "application/json; charset=UTF-8", 
                "Authorization": "Bearer " + getCookie("accessToken")}}
        );
        if (String(answer.data["status"]) == "success"){
            let pardonbutt = document.getElementById("binpin");
		    let butt = document.getElementById("binpinA");
            let pinbutton = document.getElementById("pinButton");
            if (answer.data["state"]){
		        pardonbutt.style.display = "none";
		        butt.style.display = "block";
                pinbutton.style.backgroundColor = "rgb(109, 109, 109)";
            }else{
                pardonbutt.style.display = "block";
		        butt.style.display = "none";
                pinbutton.style.backgroundColor = "";
            }
        }
        else if (String(answer.data["status"]) == "error"){
            alert(answer.data["message"]);
        }
    }
	
    
}
function DynamicForm({id}){
  
  	const {data, isLoading, isError} = useQuery(['votes', id], loadVote);
	
	if (isLoading || isError || !data) return (
		<div className={styles.load}>
			<img className={styles.img} src="/res/icons/logo.png"></img>
			</div>
		);
  	if (isError || !data) return (
      <div className={styles.load}>
        <img className={styles.img} src="/res/icons/logo.png"></img>
        </div>
      );
  	if (data.status == "error") return <div className={styles.load}><p className={styles.p}>{data.message}</p></div>;
 	 const listItems = (data.fields).map(vote =>
    	<div key={vote.id}>
    	<div className={styles.field}>
      		<h3 className={styles.fieldName}>{vote.field}</h3>
      			<progress className={styles.progress}
						max={data.voted_num} value={vote.votedCount}>
				</progress>
      	<p className={styles.votedCount}>{vote.votedCount + ru_voted(vote.votedCount)}</p>
      	{data.alreadyVoted ? <input className={styles.radio} type="radio" id="radio" value={vote.id} disabled={true} checked={vote.checked}/> : <input className={styles.radio} type="radio" id="radio" name="vote" value={vote.id} disabled={data.alreadyVoted} />}
      
    </div>
    <hr className={styles.hr}></hr>
    </div>
    
    );
    let perms = parseJwt(getCookie("accessToken")).permissions;
    let moder = (
        <>
            <div style={{display: "flex"}}>
                {perms == "moderator" ?
                <div className={styles.pinButton} id="pinButton" title="Закрепить голосование" onClick={() => pin(id)} style={data.pinned ? {backgroundColor: "rgb(109, 109, 109)"} : {backgroundColor: ""}}>
                    <img className={styles.binpin} id="binpin" src="/res/icons/buttons/pushpin.svg" style={data.pinned ? {display: "none"} : {display: "block"}}></img>
                    <img className={styles.binpinA} id="binpinA" src="/res/icons/buttons/pushpin.svg" style={data.pinned ? {display: "block"} : {display: "none"}}></img>
                </div>
                : ""}
                <div className={styles.deleteButton} onClick={() => deleteVote(id)} title="Удалить голосование">
                    <img className={styles.binUp} src="/res/icons/buttons/bin_up.png"></img>
                    <img className={styles.binDown} src="/res/icons/buttons/bin_down.png"></img>
                </div>
                
            </div>
            <hr className={styles.self_hr}></hr>
        </>
    )
	return (
    <div className={styles.vote}>
        <div className={styles.moderHeader}>{perms == "moderator" || data.self ? moder : ""}</div>
        <h2 className={styles.header}>{data.name}</h2>
        <p className={styles.info}>{data.info}</p>
        <div className={styles.author}>
					<img
                        className={styles.img}
						src={"https://visage.surgeplay.com/face/48/" + data.uuid + "?no=shadow,overlay,ears,cape"}
						alt={data.nickname}
					/>
					<a className={styles.a} href={"/user/" + data.nickname}>{data.nickname}</a>
				</div>
      <hr></hr>
      {listItems}
      <p id="notifier" className={styles.notifier}></p>
      <p className={styles.notifier_two}>{data.alreadyVoted ? "Вы уже проголосовали" : ""}</p>
      <button id="vote_btn" className={styles.vote_btn} onClick={data.alreadyVoted ? () => unvote(id) : vote}>{data.alreadyVoted ? "Отменить голос!" : "Проголосовать!"}</button>
      
    </div>
  );

}


