"use client";

import { login } from "./script.tsx";
import { useEffect } from 'react';
import styles from "./styles/header/style.module.css";
import { authApi, returnToLogin } from "./APImanager.tsx"
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';

const queryClient = new QueryClient();

export function Header(){
    return (
    <QueryClientProvider client={queryClient}>
    
        <title>oauth test</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&family=Manrope:wght@600&display=swap" rel="stylesheet"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <HeaderMain />
          
    </QueryClientProvider>
    )
}
async function load(){
    if (getCookie("refreshToken")){
        let request = await authApi.post("/login");
        return request.data;
    }
    returnToLogin();
    return {"status": "not logged"}
}
const HeaderMain = () => {
    const {data, isLoading, isError} = useQuery(['votes'], load);
    let dataA = data;
    if (isLoading || isError || !data) dataA = {"status": "not logged"};

    return (
        <>
        <header className={styles.header}>
            <img></img>
            <div id="card" className={styles.card}>
                <a href={dataA.status == "not logged" ? "/login/" : "/user/" + dataA.nickname} id="href-img"><img id="profile-img" className={styles.profile_img} src={"https://visage.surgeplay.com/face/56/" + (dataA.status == 'not logged' ? 'X-Steve' : dataA.uuid) + "?no=shadow,overlay,ears,cape"}></img></a>
                <a id="card-name" href={dataA.status == "not logged" ? "/login/" : ("/user/" + dataA.nickname)} className={styles.card_name}>{dataA.status == "not logged" ? "Войти" : dataA.nickname}</a>
            </div>
        </header>
        </>
    )
  }
  