const fetch = require('node-fetch');
const config = require('../config/main.js')

console.log("Starting Alpaca")

class Alpaca_Api {

    constructor() {
        this.Alpaca = require('@alpacahq/alpaca-trade-api');
        this.alpaca = new this.Alpaca({
            keyId: config.alpaca.API_KEY,
            secretKey: config.alpaca.SECRET,
            paper: true,
        })
    }

    /**
     * @param {String} ticker
     * @param {Number} qty - # of shares you wanna buy 
     *  Submit a market order at market price
     */
    createBuyOrder(ticker, qty) {
        this.alpaca.createOrder({
            symbol: ticker,
            qty: qty,
            side: 'buy',
            type: 'market',
            time_in_force: 'day'
        })
    }

    /**
     * @param {String} ticker 
     * @param {Number} qty 
     * Submit a limit order to attempt to sell at
     * particular price when the market opens
     */
    createSellOrder(ticker, qty) {
        this.alpaca.createOrder({
            symbol: 'AMD',
            qty: 1,
            side: 'sell',
            type: 'limit',
            time_in_force: 'opg',
            limit_price: 20.50
        })
    }

    /**
     * Get all positions for logged in account
     */
    getPositions() {
        return this.alpaca.getPositions()
    }
}

module.exports = Alpaca_Api;





