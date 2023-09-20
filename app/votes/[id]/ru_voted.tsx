export function ru_voted(count: number){
    let votes = String(count);
    let past = String(votes.slice(-1));
    let first = String(votes.slice(-2, -1));

    if (past == "1" && parseInt(votes) != 11) return " голос";
    else {if ((past == "2" || past == "3" || past == "4") && first != "1") return " голоса";}
    return " голосов";
}