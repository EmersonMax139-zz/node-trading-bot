const polygon_api = require('../api/polygon.js');
const alpaca_api = require('../api/alpaca.js');
const moment = require('moment');
const tickers = require('../watchlist.js');

// Initialize
const polygon = new polygon_api;
const alpaca = new alpaca_api;

// Globals (If this becomes a class put them in constructor)
let time_to_close; 

const run = async function() {

    // Cancel any existing orders so they don't affect buying power
    let orders; 
    await alpaca.getOrders({
        status:'all',
        direction:'asc'
    }).then(response => {
        orders = response;    
    }).catch(err => console.log(err));

    orders.forEach(async (order) => {
        alpaca.cancelOrder(order.id)
            .catch(err => console.log(err));
    })

    // Wait for market to open
    console.log("Waiting for market to open...");
    await waitForMarketOpen()
    console.log("Market now open")

}

// Check every minute until market is open 
// make sure to await this
async function waitForMarketOpen() {
    let is_open = false; 

    return new Promise((resolve, reject) => {
        const marketSpinner = setInterval(async () => {
            await alpaca.getClock().then(async (response) => {
                is_open = response.is_open;
                if(is_open) {
                    clearInterval(marketSpinner)
                    return
                } else {
                    let open_time;
                    let current_time; 
                    await alpaca.getClock().then(response => {
                        open_time = new Date(response.next_open.substring(0, response.next_close.length - 6));
                        current_time = new Date(response.timestamp.substring(0, response.timestamp.length - 6));
                    }).then(() => {
                        time_to_close = Math.floor((open_time - current_time) / 1000 / 60);
                    }).catch(err => console.log(err))

                    console.log(`${time_to_close} minutes till next market open`);
                }
            }).catch(err => console.log(err))            
        }, 5000)
    });    
}

run();