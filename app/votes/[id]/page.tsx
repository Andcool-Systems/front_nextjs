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
import { loadVote } from "./login.tsx"
import { ru_voted } from "./ru_voted.tsx"
 


//import { useSearchParams } from 'next/navigation'

const queryClient = new QueryClient();

export default function Home({ params }: { params: { id: string } }) {

    return (
		<>
		<title>Votes</title>
    	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    	<link rel="stylesheet" href="/res/votes/vote/style.css"></link>
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
    console.log(select);
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
          console.log(":");
          location.reload();
      }else{
          notifier.style.display = "block";
          notifier.textContent = answer.data["message"];
      }
  
}
function DynamicForm({id}){
  
  const {data, isLoading, isError} = useQuery(['votes', id], loadVote);
	
	if (isLoading || isError || !data) return (
		<div id="load">
			<img src="/res/icons/logo.png"></img>
			</div>
		);
  if (isError || !data) return (
      <div id="load">
        <img src="/res/icons/logo.png"></img>
        </div>
      );
  if (data.status == "error") return <div id="load"><p>{data.message}</p></div>;
  const listItems = (data.fields).map(vote =>
    <>
    <div id="field" key={vote.key}>
      <h3 id="fieldName">{vote.field}</h3>
      <progress id="progress"
						max={data.voted_num} value={vote.votedCount}>
				</progress>
      <p id="votedCount">{vote.votedCount + ru_voted(vote.votedCount)}</p>
      {data.alreadyVoted ? <input type="radio" id="radio" value={vote.id} disabled={true} checked={vote.checked}/> : <input type="radio" id="radio" name="vote" value={vote.id} disabled={data.alreadyVoted} />}
      
    </div>
    <hr></hr>
    </>
  );
	return (
    <div className="vote">
      <h2 id="header">{data.name}</h2>
      <p id="info">{data.info}</p>
      <div id="author">
					<img
						src={"https://visage.surgeplay.com/face/48/" + data.uuid + "?no=shadow,overlay,ears,cape"}
						alt={data.nickname}
					/>
					<a href={"/user/" + data.nickname}>{data.nickname}</a>
				</div>
      <hr></hr>
      {listItems}
      <p id="notifier" className="notifier"></p>
      <p className="notifier-two">{data.alreadyVoted ? "Вы уже проголосовали" : ""}</p>
      <button id="vote_btn" onClick={data.alreadyVoted ? () => unvote(id) : vote}>{data.alreadyVoted ? "Отменить голос!" : "Проголосовать!"}</button>
      
    </div>
  );

}


