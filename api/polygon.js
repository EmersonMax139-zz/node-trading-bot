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
        getStockPriceByTicker: async (ticker) => {
            let price = 0; 

            fetch(`https://api.polygon.io/v1/last/stocks/${ticker}?apiKey=${API_KEY}`, {
                method: "GET"
            })
            .then(response => response.json())
            .then(json => {
                price = json.last.price;
                return price;
            })
            .catch(err => {
                console.error(err);
            })
        },        
    }    
}

module.exports = Polygon_Api

