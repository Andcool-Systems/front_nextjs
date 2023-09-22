export function moveToPage(page_url){
    if (typeof window !== "undefined") {
        const protocol = window.location.protocol;
        const host = window.location.host;
        window.location.replace(protocol + "//" + host + page_url);
    }
}