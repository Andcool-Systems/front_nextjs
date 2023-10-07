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
import filterStyle from "../styles/votes/filter.module.css";
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

function setFilter(setFilterState, id: number, setData, setCurrentPage, setFetching, setTotalCount, setCostyl){
	setFilterState(id);
	setData([]);
	setCurrentPage(0);
	setFetching(true);
	setTotalCount(1);
	setCostyl((prevState: number) => prevState + 1);
}
var api = process.env.NEXT_PUBLIC_API_URL
function Main(){
	const [dataa, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [success, setSuccess] = useState(false);
	const [totalCount, setTotalCount] = useState(1);
	const [filterState, setFilterState] = useState(0);
	const [costyl, setCostyl] = useState(0);

	useEffect(() => {
		if (fetching && dataa.length < totalCount){
			const url = `/votes?page=${currentPage}&count=20&filter=${filterState}`
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
	}, [fetching, costyl])

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

	const filterOptions = [
		{id: 0, name:"Активные"}, 
		{id: 1, name:"Созданные модераторами"}, 
		{id: 2, name:"Закрытые"},
		{id: 3, name:"Закреплённые"}]

	const filterFields = filterOptions.map(field =>
		<p key={field.id} onClick={() => setFilter(setFilterState, field.id, setData, setCurrentPage, setFetching, setTotalCount, setCostyl)} style={filterState == field.id ? {backgroundColor: "#222831"} : {}} className={filterStyle.field}>{field.name}</p>
	);
	
    return (
    <>	
		<div className={filterStyle.parent}>
			<div className={filterStyle.main}>
				<div className={filterStyle.child}>
					{filterFields}
				</div>

			</div>
		</div>
        <ul className={styles.ul}>{dataa.length == 0 && !success ? <div className={styles.load}><img className={styles.img} src="/res/icons/logo.png"></img></div> : listItems}</ul>
		{dataa.length != totalCount && dataa.length != 0 ? <div className={styles.loadrel}><img className={styles.img} src="/res/icons/logo.png"></img></div> : ""}
      
    </>
    )

}
