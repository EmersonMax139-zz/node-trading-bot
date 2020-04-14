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
        return this.alpaca.createOrder({
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
        return this.alpaca.createOrder({
            symbol: 'AMD',
            qty: 1,
            side: 'sell',
            type: 'limit',
            time_in_force: 'opg',
            limit_price: 20.50
        })
    }

    /**
     * Cancel order
     * @param {String} id  
     */
    cancelOrder(id) {
        return this.alpaca.cancelOrder(id);
    }

    /**
     * Get orders
     * @param {Object} params - (status, direction)
     */
    getOrders(params) {
        return this.alpaca.getOrders(params)
    }

    /**
     * Get all positions for logged in account
     */
    getPositions() {
        return this.alpaca.getPositions()
    }


    /**
     * Get single position
     */
    getPosition(ticker) {
        return this.alpaca.getPosition(ticker);
    }

    /**
     * Get bars
     * @param {Object} params - optional (limit, ...) 
     */
    getBars(time, ticker, params) {
        return this.alpaca.getBars(time, ticker, params)
    }

    /**
     * 
     */
    getClock() {
        return this.alpaca.getClock();
    }

}

module.exports = Alpaca_Api;





