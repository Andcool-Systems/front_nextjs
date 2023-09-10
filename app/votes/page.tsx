"use client";
import { useEffect } from 'react';
import axios from 'axios';
import { loadVotes } from "./login.tsx"

export default function Home() {
    const votes = loadVotes().then((votes) => {
        
        var listItems = votes.map(person =>
            
            <li key={person.id}>
              <p>
                <b>{person.name}</b>
                  {' ' + person.profession + ' '}
                  known for {person.accomplishment}
              </p>
            </li>
        );
        console.log(votes);
        var ul = document.getElementById("votes");
        ul.appendChild(listItems);
      })
      return <ul id="votes"></ul>;
}
