const WebSocket = require('ws');
const config = require('./config/main.js');

const ws = new WebSocket('wss://socket.polygon.io/stocks');
const ws_crypto = new WebSocket('wss://socket.polygon.io/crypto');
const API_KEY = config.alpaca.API_KEY;

// Open Stock websocket
ws.on('open', () => {
    console.log(`Connected`);
    ws.send(`{"action":"auth","params":"${API_KEY}"}`)
	ws.send(`{"action":"subscribe","params":"Q.MSFT"}`) // T - Trade | Q - Quote 
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

// // Open Crypto websocket
// ws_crypto.on('open', () => {
//     console.log(`Crypto Connected`);
//     ws.send(`{"action":"auth","params":"${API_KEY}"}`)
// 	ws.send(`{"action":"subscribe","params":"XQ.BTC"}`) 
// })

// // Per message packet:
// ws_crypto.on('message', ( data ) => {
// 	data = JSON.parse( data )
// 	data.map(( msg ) => {
// 		if( msg.ev === 'status' ){
// 			return console.log('Status Update:', msg.message)
// 		}
// 		console.log('Tick:', msg)
// 	})
// })

// ws_crypto.on('error', console.log)