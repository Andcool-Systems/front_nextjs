export function moveToPage(page_url){
    const protocol = window.location.protocol;
    const host = window.location.host;
    window.location.replace(protocol + "//" + host + page_url);
}