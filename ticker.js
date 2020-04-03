const WebSocket = require('ws');
const config = require('./config/main.js');

const ws = new WebSocket('wss://socket.polygon.io/stocks');
const ws_crypto = new WebSocket('wss://socket.polygon.io/crypto');
const API_KEY = config.alpaca.API_KEY; 

// Open Stock websocket
ws.on('open', () => {
    console.log(`Connected`);
    ws.send(`{"action":"auth","params":"${API_KEY}"}`)
	ws.send(`{"action":"subscribe","params":"Q.MSFT,Q.QQQ,Q.AMD"}`) // T - Trade | Q - Quote 
})


// Per message packet:
ws.on('message', ( data ) => {
	data = JSON.parse( data )
	data.map(( msg ) => {
		if( msg.ev === 'status' ){
			return console.log('Status Update:', msg.message)
		}
		console.log('Tick:', msg)
	})
})

ws.on('error', console.log)
