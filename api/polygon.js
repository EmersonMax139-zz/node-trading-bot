const fetch = require('node-fetch');
const config = require('../config/main.js');

let ticker = 'QQQ';

const API_KEY = config.alpaca.API_KEY;


const Polygon_Api = {

    "polygon": {

        /**
         * @param {String} ticker
         * Replace api key
         */
        getStockPriceByTicker: (ticker) => {

            let price = 0; 
            return new Promise((resolve, reject) => {
                fetch(`https://api.polygon.io/v1/last/stocks/${ticker}?apiKey=${API_KEY}`, {
                    method: "GET"
                })
                .then(response => response.json())
                .then(json => {
                    return resolve(json);
                })
                .catch(err => {
                    return reject(err);
                })
            })    
        },

        /**
         * Returns top 20 gaining stocks for the day (top % gain)
         */
        getTopGainers: () => {
            return new Promise((resolve, reject) => {
                fetch(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${API_KEY}`, {
                    method: "GET"
                })
                .then(response => response.json())
                .then(json => {
                    return resolve(json);
                })
                .catch(err => {
                    return reject(err);
                })
            })
        },
        /**
         * Returns some info on a given date range
         * @params {String} Date 
         */
        getAggregateData: (ticker, multiplier, start, end) => {
            return new Promise((resolve, reject) => {
                fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/day/${start}/${end}?apiKey=${API_KEY}`, {
                    method: "GET"
                })
                .then(response => response.json())
                .then(json => {
                    return resolve(json);
                })
                .catch(err => {
                    return reject(err);
                })
            })
        }
    }    
}

module.exports = Polygon_Api


