const cron = require('node-cron');
const alpaca_api = require('./api/alpaca.js');
const polygon_api = require('./api/polygon.js');

// Initialize
const alpaca = new alpaca_api;
const polygon = new polygon_api;

async function getPositions() {
    const response = await alpaca.getPositions();
    console.log(response);
}

async function price() {
    const response = await polygon.getStockPriceByTicker('MSFT');
    const price = response.last.price
    setTimeout(() => {
        console.log(price);
    }, 1000)
}

// setInterval(async () => {
//     const response = await polygon.getStockPriceByTicker('MSFT');
//     const price = response.last.price
//     setTimeout(() => {
//         console.log(price);
//     }, 1000);
// }, 3000); 



// getPositions();
async function bars() {
    await alpaca.getBars('1D', 'MSFT', {limit: 20})
        .then(response => {
            console.log(response)
        })
}

async function clock() {
    await alpaca.getClock().then(response => {
        console.log(response)
    })
}

async function account() {
    await alpaca.getAccount().then(response => {
        console.log(response);
    })
}


account();



