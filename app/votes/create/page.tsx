"use client";

import { useEffect } from 'react';
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
 
import styles from "../../styles/votes/create/style.module.css";
import "../../styles/votes/create/style.css"

import { authApi, returnToLogin } from "../../APImanager.tsx"

const queryClient = new QueryClient();

export default function Home() {

    return (
		<>
		<title>Votes</title>
    	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
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
var api = process.env.NEXT_PUBLIC_API_URL
async function create(data){
    var qs = require('qs');
    let header = document.getElementById("header") as HTMLInputElement;
    let info = document.getElementById("info") as HTMLInputElement;
    let elements = [];
    let filled = true;
    let dateValue = (document.getElementById("dateInput") as HTMLInputElement).value;
    const date = +new Date(dateValue)

    for (let element of data) {
        elements.push(element.vote);
        if (element.vote == "") filled = false;
    }
    if (header.value == "" || info.value == "" || dateValue == "") filled = false;
    var notifier = document.getElementById("notifier") as HTMLInputElement;
    if (filled){
        notifier.style.display = "none";
        notifier.textContent = "";
        let url = "/createPost"
        let answer = await authApi.post(url, {
            params: {
                "header": header.value,
                "info": info.value,
                "expiresAt": Math.floor(date / 1000),
                "fields": elements
            },
            paramsSerializer: (params: any) => {
                return qs.stringify(params)
            }
        }
        );
        if (String(answer.data["status"]) == "success"){
            moveToPage("/votes/");
        }else{
          notifier.style.display = "block";
          notifier.textContent = answer.data["message"];
        }
    }else{
        notifier.style.display = "block";
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

  const setDate = () => {
    let dateInput = document.getElementById("dateInput") as HTMLInputElement;
    dateInput.min = new Date().toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
  }

  return (
    <div className={styles.create}>
        <input
            id='header'
            className={styles.header}
            placeholder='Заголовок'
            maxLength={100}
        />
        <br />
        <textarea
            id='info'
            className={styles.info}
            placeholder='Описание'
            maxLength={5000}
        />
        {formFields.map((form, index) => {
          return (
                <div className={styles.voteField} key={index}>
                    <input
                        name='vote'
                        className={styles.inputField}
                        placeholder='Вариант ответа...'
                        onChange={event => handleFormChange(event, index)}
                        value={form.vote}
                    />
                    <button onClick={() => removeFields(index)} className={styles.removeButt}>-</button>
                </div>
            
          )
        })}

        <button onClick={addFields} className={styles.addBtn}>Добавить вариант ответа</button>
        <br/>
        <hr className={styles.hr}></hr>
        <p className={styles.timeText}>Голосование истекает через:</p><br/>
        <input className={styles.dateInput} type="datetime-local" id="dateInput" onFocus={setDate}/>
        <br/>
        <p id="notifier" className={styles.notifier}></p>
        <button onClick={submit} className={styles.submitBtn}>Опубликовать</button>
    </div>
  );
}
