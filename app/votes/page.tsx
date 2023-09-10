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
	return <ul>{listItems}</ul>;
}
