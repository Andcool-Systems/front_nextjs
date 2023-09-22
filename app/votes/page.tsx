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

const queryClient = new QueryClient();

export default function Home() {

    return (
		<>
		<title>Votes</title>
    	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    	<link rel="stylesheet" href="res/votes/style.css"></link>
    	<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
		<QueryClientProvider client={queryClient}>
			<HydrationProvider>
                <Client>
					<body>
						<Header />
						<Main />
					</body>

			  	</Client>
            </HydrationProvider>
		</QueryClientProvider>
		</>
	  );
}
interface IVote {
    id: number;
    name: string;
    info: string;
    expires: number;

	nickname: string;
	uuid: string;

	votes_num: string;
	created: string;
    expires_date: string;
}

var api = process.env.NEXT_PUBLIC_API_URL
function Main(){
	const [dataa, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [totalCount, setTotalCount] = useState(1);

	useEffect(() => {
		if (fetching && dataa.length < totalCount){
			const url = api + `/votes?page=${currentPage}&count=20`
			axios.get(url, {headers: {"Content-type": "application/json; charset=UTF-8", 
					"Authorization": "Bearer " + getCookie("accessToken")
					}}
				).then(response => {
					setData([...dataa, ...response.data.data]);
					setCurrentPage(prevState => prevState + 1);
					setTotalCount(parseInt(response.data.totalCount));
					
				})
				.finally(() => setFetching(false))
		}
	}, [fetching])

	useEffect(() => {
		document.addEventListener('scroll', scrollHandler);
		return function (){
			document.removeEventListener('scroll', scrollHandler);
		}
	}, [])

    const scrollHandler = (e) => {
		if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100){
			setFetching(true);
		}
	}
	const listItems = dataa.map(vote =>
		<li key={vote.id} id="li">
			<div id="progress-votes">
				<progress id="progress"
						max="100" value={vote.expires}>
				</progress>
			</div>
			<div id="time">
				<p>{vote.expires_date}</p>
				<p>{vote.created}</p>
			</div>
			<div id="main-votes">
				<Link id="link-head" href={{ pathname: '/votes/' + vote.id}}><h2><b>{vote.name}</b><br/></h2></Link>
				<p>{vote.info}</p>
				<div id="author">
					<img
						src={"https://visage.surgeplay.com/face/48/" + vote.uuid + "?no=shadow,overlay,ears,cape"}
						alt={vote.nickname}
					/>
					<a href={"/user/" + vote.nickname}>{vote.nickname}</a>
				</div>
				<p id="votes_num">{vote.votes_num}</p>
			</div>
		</li>
	  );
    return (
    <>
        <ul id="votes">{listItems}</ul>
      
    </>
    )

}
