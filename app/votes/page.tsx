"use client";

import { useEffect } from 'react';
import axios from 'axios';
import { loadVotes } from "./login.tsx"
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';
import Link from 'next/link';
//import { useSearchParams } from 'next/navigation'

const queryClient = new QueryClient();

export default function Home() {

    return (
		<QueryClientProvider client={queryClient}>
		  <Main />
		</QueryClientProvider>
	  );
}

function Main(){
	//const searchParams = useSearchParams();
	//console.log(searchParams.get("aboba"));
	const { data, isLoading, isError} = useQuery('votes', loadVotes);
	if (isLoading) return <h1>Загрузка...</h1>
	if (isError) return <h1>Ошибка...</h1>
	if (!data) return <h1>Нет данных...</h1>
	const listItems = data.map(vote =>
		<li key={vote.id}>
			<div id="progress-votes">
				<progress id="progress"
						max="100" value={vote.expires}>
				</progress>
			</div>
			<div id="main-votes">
				<Link id="link-head" href={{ pathname: '/votes/vote', query: { "id": vote.id } }}><h2><b>{vote.name}</b><br/></h2></Link>
				<p>{vote.info}</p>
			</div>
		</li>
	  );
    return (
    <>

    <title>oauth test</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    <link rel="stylesheet" href="res/votes/style.css"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <body>
        <ul id="votes">{listItems}</ul>
      </body>
    </>
    )

}
