const cron = require('node-cron');
const alpaca_api = require('./api/alpaca.js');
const polygon_api = require('./api/polygon.js');

// Initialize alpaca class
const alpaca = new alpaca_api;

async function getPositions() {
    const response = await alpaca.getPositions();
    console.log(response);
}

async function price() {
    const response = await polygon_api.polygon.getStockPriceByTicker('MSFT');
    const price = response.last.price
    setTimeout(() => {
        console.log(price);
    }, 1000)
}

// setInterval(async () => {
//     const response = await polygon_api.polygon.getStockPriceByTicker('MSFT');
//     const price = response.last.price
//     setTimeout(() => {
//         console.log(price);
//     }, 1000);
// }, 3000); 



getPositions();


