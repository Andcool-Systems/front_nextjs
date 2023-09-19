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
 


//import { useSearchParams } from 'next/navigation'

const queryClient = new QueryClient();

export default function Home() {

    return (
		<>
		<title>Votes</title>
    	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
    	<link rel="stylesheet" href="/res/votes/create/style.css"></link>
    	<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
		<QueryClientProvider client={queryClient}>
            <Header />
            <HydrationProvider>
                <Client>
                    <DynamicForm />
                </Client>
            </HydrationProvider>
		</QueryClientProvider>
		</>
	  );
}
var api = "http://192.168.0.105:8080"
async function create(data){
    var qs = require('qs');
    let header = document.getElementById("header") as HTMLInputElement;
    let info = document.getElementById("info") as HTMLInputElement;
    let elements = [];
    let filled = true;
    for (let element of data) {
        elements.push(element.vote);
        if (element.vote == "") filled = false;
    }
    if (header.value == "" || info.value == "") filled = false;
    var notifier = document.getElementById("notifier") as HTMLInputElement;
    if (filled){
        notifier.textContent = "";
        let url = api + "/createPost"
        let answer = await axios.post(url, {
            params: {
                "header": header.value,
                "info": info.value,
                "expiresAt": 1702923488,
                "fields": elements
            },
            paramsSerializer: (params: any) => {
                return qs.stringify(params)
            }
        }, {headers: {"Content-type": "application/json; charset=UTF-8", 
            "Authorization": "Bearer " + getCookie("accessToken")}}
        );
        if (answer.status == 201){
            moveToPage("/votes/");
        }
    }else{
        notifier.textContent = "Пожалуйста, заполните все поля выше"
    }
}
function DynamicForm(){
  

  const [formFields, setFormFields] = useState([
    { vote: 'Да'},
    { vote: 'Нет'}
  ])


  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const submit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    create(formFields);
  }

  const addFields = () => {
    if (formFields.length < 10){
      let object = {
        vote: ''
      }
      setFormFields([...formFields, object])
    }
  }

  const removeFields = (index: number) => {
    if (formFields.length > 2){
      let data = [...formFields];
      data.splice(index, 1)
      setFormFields(data)
    }
  }

  return (
    <div className="create">
        <input
            id='header'
            placeholder='Заголовок'
            maxLength={50}
        />
        <br />
        <textarea
            id='info'
            placeholder='Описание'
            maxLength={3000}
        />
        {formFields.map((form, index) => {
          return (
                <div className='voteField'>
                    <input
                        name='vote'
                        placeholder='Вариант ответа...'
                        onChange={event => handleFormChange(event, index)}
                        value={form.vote}
                        id="inputField"
                    />
                    <button onClick={() => removeFields(index)} id="removeButt">-</button>
                </div>
            
          )
        })}
        <p id="notifier"></p>
        <button onClick={addFields} id="addBtn">Добавить вариант ответа</button>
        <br />
        <button onClick={submit} id="submitBtn">Опубликовать</button>
    </div>
  );
}
