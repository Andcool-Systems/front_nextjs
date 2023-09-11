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

const queryClient = new QueryClient();

async function fetchVotes(){
	const data = await loadVotes();
	return data;
}

export default function Home() {

    return (
		<QueryClientProvider client={queryClient}>
		  <Main />
		</QueryClientProvider>
	  );
}

function Main(){
	const { data, isLoading, isError} = useQuery('votes', fetchVotes);
	if (isLoading) return <h1>Загрузка...</h1>
	if (isError) return <h1>Ошибка...</h1>
	if (!data) return <h1>Нет данных...</h1>
	const listItems = data.map(person =>
		<li key={person.id}>
		  <p>
			<b>{person.name}</b>
			  {' ' + person.profession + ' '}
			  known for {person.accomplishment}
		  </p>
		</li>
	  );
    return (
    <>

    <title>oauth test</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <link rel="stylesheet" href="res/votes/style.css"></link>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <body>
        <ul id="votes">{listItems}</ul>
      </body>
    </>
    )

}
