"use client";
import Script from "next/script"
import { useEffect } from 'react';
import { loadUser, logout } from "./script.tsx"
import { Header } from '../../header.tsx'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from 'react-query';

const queryClient = new QueryClient();

export default function Home({ params }: { params: { name: string } }) {
    useEffect(() => {
        //login();
      });
    return (
    <>
    <title>{params.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <link rel="stylesheet" href="/res/user/style.css"></link>
    <QueryClientProvider client={queryClient}>
        
        <HydrationProvider>
            <Client>
                <body>
                    <Header />
                    <DynamicForm id={params.name}/>
                </body>
                </Client>
        </HydrationProvider>
    </QueryClientProvider>
    </>
    )
}
function DynamicForm({id}){
  
    const {data, isLoading, isError} = useQuery(['votes', id], loadUser);
      
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

    const votes = (data.votes).map(vote =>
      <div key={vote.key}>
        <div id="field">
          <a id="name" href={"/votes/" + vote.id}>{vote.name}</a>
          <p id="info">{vote.info}</p>
          <p id="voted">{vote.votedNum}</p>
        </div>
        <hr></hr>
      </div>
    );
    
    
    const root = (
        <div id="root">
            <hr id="self-hr"></hr>
            <h3>Настройки аккаунта:</h3>
            <button onClick={ logout } id="logout-button">Выйти</button>
        </div>
    );
    return (
      <div className="user">
        <div id="card">

            <img id="profile-imgg" src={"https://visage.surgeplay.com/face/56/" + data.uuid + "?no=shadow,overlay,ears,cape"}></img>
            <div id="card-namee">
                <div id="nn">
                  <h2 id="nickname">{data.nickname}</h2>
                  {data.badge != "" ? <img id="badge" title={data.badgeInfo} src={"/res/badges/" + data.badge + ".png"}></img> : ""}
                </div>
                <p id="uuid">{data.uuid}</p>
            </div>
    
        </div>
        {data.self ? root : ""}
        {(data.votes).length != 0 ? 
        <>
          <hr id="self-hr"></hr>
          <h3>Голосования игрока:</h3>
          <div id="votes-scrollable">
              {votes}
          </div>
        </>
        : ""}
      </div>
    );
  
  }