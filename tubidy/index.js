const { JSDOM } = require('jsdom')
async function fetcher(url){
    try{
        const response = await fetch('https://tubidy.mobi/search.php?q='+ url)
        const data = await response.text();
        return new JSDOM(data);
       }catch(err){
         console.error("Error: " ,err); 
       }
}
function getMusicInfo(query){
    return fetcher(query).then(HTML => {
                    let card = HTML.window.document.body.getElementsByClassName('media')[0];
                    let tubidy = 'https://tubidy.mobi/'
                    let downloadPage = card.children[0].children[0].href
                    let thumbnail = card.children[0].children[0].children[0].src
                    let name = card.children[1].children[0].children[0].innerHTML
                    return fetch('https:' + downloadPage, {method: 'GET',cookie: 'sid=6d4ab824fd25dc17a8d5a27f3d67fee0'}).then(response => response.text()).then(async HTMLDoc => {
                                let html = new JSDOM(HTMLDoc)
                                let pointToDownload = html.window.document.body.getElementsByClassName('title')
                                let video = await fetch(tubidy+ pointToDownload.item(0).href).then(response => response.text()).then(lastPage => {return new JSDOM(lastPage).window.document.getElementsByClassName('title').item(2).href})
                                let audio = await fetch(tubidy+ pointToDownload.item(1).href).then(response => response.text()).then(lastPage => {return new JSDOM(lastPage).window.document.getElementsByClassName('title').item(2).href})
                                return {name, audio, video, thumbnail: tubidy + thumbnail}
                            })
    })
}

module.exports = getMusicInfo