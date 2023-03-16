const wa = require('@open-wa/wa-automate');
const getMusicInfo = require('./tubidy')
const {
    PythonShell: shell
} = require('python-shell');


wa.create({
    sessionId: "DEMO",
    multiDevice: true, //required to enable multiDevice support
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    useChrome: true,
    killProcessOnBrowserClose: true,
    hostNotificationLang: 'EN_US',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(async message => {
        let msgbody = message.body
        if(msgbody === ''){
            await client.sendText(message.from, "Sorry, I don't understand that, Please try again")
        }
        
        else if(msgbody.startsWith('download', 0)){
            let downloadQuery = msgbody.slice(8)
            console.table({downloadQuery, msgbody})
            getMusicInfo(downloadQuery).then(async responseObj => {
                await client.sendFileFromUrl(message.from, responseObj.audio, responseObj.name)
            })
        }
        else {
        console.table({
            msgbody: msgbody
        })
        let pyshell = new shell('scrapper.py', {
            args: [msgbody]
        });
        pyshell.on('message', async function (messages) {
            let data = JSON.parse(messages);
            await client.sendImage(message.from, data.image, 'any', '*' + data.summary + '* \n\n' + data.description, undefined, undefined, undefined, false, true)
        });

        pyshell.end(function (err, code, signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        });}
    });
}