const getMediaInfo = require('./tubidy')
const {
  Wit
} = require('node-wit');
const qrcode = require('qrcode-terminal');
const {
  Client,
  LocalAuth,
  MessageMedia
} = require('whatsapp-web.js');
require('dotenv').config()

let {
  WIT_TOKEN
} = process.env
let client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable'
  }
});

let actions = {
  confirm_order(contextMap) {
    return {
      context_map: {
        ...contextMap,
        order_confirmation: 'PIZZA42'
      }
    };
  },
};

let WitClient = new Wit({
  accessToken: WIT_TOKEN,
  actions,
});
client.on('qr', qr => {
  qrcode.generate(qr, {
    small: true
  });
});
client.on('ready', async () => {
  await client.sendPresenceAvailable();
  console.log('Client is online!');
});
client.on('message', async message => {
  await client.sendSeen(message.from)
  let msgbody = message.body.toLowerCase();
  console.table({
    body: msgbody
  })
  let bodyHasVideo = msgbody.includes('video')
  if (bodyHasVideo) {
    msgbody = msgbody.replace('video', '')
  }
  let entities = (await WitClient.message(msgbody)).entities;
  console.log(entities['get_media:audio'])
  if ('get_media:audio' in entities) {
    await client.sendMessage(message.from, '🔄 Processing your request')
    getMediaInfo(entities['get_media:audio'][0].value).then(async resObject => {
      let media = await MessageMedia.fromUrl(bodyHasVideo ? resObject.video : resObject.audio)
      media.mimetype = bodyHasVideo ? 'video/mp4' : 'audio/mp4';
      media.filename = resObject.name
      await client.sendMessage(message.from, '✅ Downloading your ' + (bodyHasVideo ? 'video' : 'audio') + ' file')
      await client.sendMessage(message.from, media)
    })
  }
})
client.initialize();