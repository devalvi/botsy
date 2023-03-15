const wa = require('@open-wa/wa-automate');
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
    hostNotificationLang: 'EN_US',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(message => {
        let msgbody = message.body 
        console.table({msgbody: msgbody})
        let pyshell = new shell('scrapper.py', {args: [msgbody]});
        pyshell.on('message', async function (messages) {
        let data = JSON.parse(messages);
        await client.sendImage(message.from, data.image, 'any', '*' + data.summary + '* \n ' + data.description, undefined, undefined, undefined, false, true)
        });

        pyshell.end(function (err, code, signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        });


        


    });
}