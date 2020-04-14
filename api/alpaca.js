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
    createBuyOrder(ticker, qty, limit_price, type) {
        if(qty > 0) {
            return this.alpaca.createOrder({
                symbol: ticker,
                qty: qty,
                side: 'buy',
                type: type,
                time_in_force: 'day',
                limit_price: limit_price
            })
        } else {
            console.log("quantity must be greater than 0");
        }    
    }

    /**
     * @param {String} ticker 
     * @param {Number} qty 
     * Submit a limit order to attempt to sell at
     * particular price when the market opens
     */
    createSellOrder(ticker, qty, limit_price, type) {
        if(qty > 0) {
            return this.alpaca.createOrder({
                symbol: ticker,
                qty: qty,
                side: 'sell',
                type: type,
                time_in_force: 'day',
                limit_price: limit_price
            })
        } else {
            console.log("Quantity must be greater than 0")
        }    
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
     * Get account
     */
    getAccount() {
        return this.alpaca.getAccount();
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

    /**
     * @param {Object} params - (start, end)
     */ 
    getCalendar(params) {
        return this.alpaca.getCalendar(params);
    }

}

module.exports = Alpaca_Api;





