"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadVotes } from "./login.tsx"
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';
import Link from 'next/link';
import { Header } from '../header.tsx'
import { HydrationProvider, Server, Client } from "react-hydration-provider";
//import { useSearchParams } from 'next/navigation'
import { getCookie } from 'cookies-next';
import styles from "../styles/votes/style.module.css";
import "../styles/votes/style.css"
import { authApi, returnToLogin } from "../APImanager.tsx"

const queryClient = new QueryClient();

export default function Home() {

    return (
		<>
		<title>Votes</title>
    	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    	<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
		<QueryClientProvider client={queryClient}>
			<HydrationProvider>
                <Client>
					<Header />
					<Main />
			  	</Client>
            </HydrationProvider>
		</QueryClientProvider>
		</>
	  );
}

var api = process.env.NEXT_PUBLIC_API_URL
function Main(){
	const [dataa, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [success, setSuccess] = useState(false);
	const [totalCount, setTotalCount] = useState(1);

	useEffect(() => {
		if (fetching && dataa.length < totalCount){
			const url = `/votes?page=${currentPage}&count=20`
			authApi.get(url
				).then(response => {
					if (response.data.status == "success"){
						setData([...dataa, ...response.data.data]);
						setCurrentPage(prevState => prevState + 1);
						setTotalCount(parseInt(response.data.totalCount));
						setSuccess(response.data.status);
					}else{
						
					}
					
				})
				.finally(() => setFetching(false))
		}
	}, [fetching])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		window.addEventListener("resize", scrollHandler);
		return function (){
			document.removeEventListener('scroll', scrollHandler);
			window.removeEventListener("resize", scrollHandler);
		}
	}, [])


    const scrollHandler = (e: any) => {
		if(document.documentElement.scrollHeight - (document.documentElement.scrollTop + window.innerHeight) < 100){
			setFetching(true);
		}
	}
	const listItems = dataa.map(vote =>
		<div key={vote.id}>
		<li className={styles.li}>
			<div className={styles.progressVotes}>
				<progress className={styles.progress}
						max="100" value={vote.expires}>
				</progress>
			</div>
			<div className={styles.time}>
				<p className={styles.p}>{vote.expires_date}</p>
				<p className={styles.p}>{vote.created}</p>
			</div>
			
			<div className={styles.main_votes}>
				{vote.pinned ? 
				<div className={styles.pinned}>
					<img className={styles.pinIco} src="/res/icons/buttons/pushpin.svg"></img>
					<p className={styles.pinnedText}>Закреплено</p>
				</div> : ""}

				<Link className={styles.link_head} href={{ pathname: '/votes/' + vote.id}}><h2 className={styles.h2}><b>{vote.name}</b><br/></h2></Link>
				<p className={styles.p}>{vote.info}</p>
				<div className={styles.author}>
					<img
						className={styles.img}
						src={"https://visage.surgeplay.com/face/48/" + vote.uuid + "?no=shadow,overlay,ears,cape"}
						alt={vote.nickname}
					/>
					<a className={styles.a} href={"/user/" + vote.nickname}>{vote.nickname}</a>
				</div>
				<p className={styles.votes_num}>{vote.votes_num}</p>
			</div>
		</li>
		
		</div>
	  );
    return (
    <>
        <ul className={styles.ul}>{dataa.length == 0 && !success ? <div className={styles.load}><img className={styles.img} src="/res/icons/logo.png"></img></div> : listItems}</ul>
		{dataa.length != totalCount && dataa.length != 0 ? <div className={styles.loadrel}><img className={styles.img} src="/res/icons/logo.png"></img></div> : ""}
      
    </>
    )

}
