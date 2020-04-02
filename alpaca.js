const fetch = require('node-fetch');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const credentials = require('./config/main.js')

console.log("Starting Alpaca")

const alpaca = new Alpaca({
    keyId: credentials.alpaca.API_KEY,
    secretKey: credentials.alpaca.SECRET,
    paper: true,
})

// alpaca.getAccount().then((account) => {
//     console.log('Current Account:', account)
// })  

let ticker = 'QQQ';
let price = '12';

const Alpaca_Api = {
    /**
     * @param {String} ticker
     * @param {Number} qty - # of shares you wanna buy 
     *  Submit a market order at market price
     */
    createBuyOrder: (ticker, qty) => {
        alpaca.createOrder({
            symbol: ticker,
            qty: qty,
            side: 'buy',
            type: 'market',
            time_in_force: 'day'
        })
    },

    /**
     * @param {String} ticker 
     * @param {Number} qty 
     * Submit a limit order to attempt to sell at
     * particular price when the market opens
     */
    createSellOrder: (ticker, qty) => {
        alpaca.createOrder({
            symbol: 'AMD',
            qty: 1,
            side: 'sell',
            type: 'limit',
            time_in_force: 'opg',
            limit_price: 20.50
        })
    }
}

module.exports = Alpaca_Api;





