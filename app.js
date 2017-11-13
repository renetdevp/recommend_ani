const express = require('express');
const facebook = require('fb-messenger-bot-api');
const process = require('process');
const bodyParser = require('body-parser');

const secret = require('./auth/secret');
const key = secret.access_token;
const ver_token = secret.verify_token;

const client = new facebook.Client(key);
const app = express();
const getList = require('./function/getList');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/webhook', (req, res) => {
    let VERIFY_TOKEN = ver_token;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {
    let body = req.body;

    if (body.object === 'page') {
        body.entry.forEach((entry) => {
            let webhookEvent = entry.messaging[0];

            if (webhookEvent.message !== undefined) {
                let sender = webhookEvent.sender;
                let msg = webhookEvent.message;

                switch (msg.text) {
                    case '시작':
                    case 'start':
                    case 'Start':
                    case 'START':
                        client.sendTextMessage(sender.id, '시작합니다!')
                            .then(() => {
                                getList.list.forEach((elem, i) => {
                                    client.sendTextMessage(sender.id, elem);
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        break;
                }
            }
        });
        res.status(200).send('EVENT_RECIEVED');
    } else {
        res.sendStatus(404);
    }
});

app.listen(process.env.PORT || 1337, () => {
    console.log('node-bot server opened');
});
