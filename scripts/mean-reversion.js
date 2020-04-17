const polygon_api = require('../api/polygon.js');
const alpaca_api = require('../api/alpaca.js');
const moment = require('moment');
const tickers = require('../watchlist.js');

// Initialize
const polygon = new polygon_api;
const alpaca = new alpaca_api;
let ticker = 'AMD';

// Globals (If this becomes a class put them in constructor)
let time_to_close; 
let running_average;
let last_order = null;

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
        console.log(`Cancelling order - ${order}`)
        alpaca.cancelOrder(order.id)
            .catch(err => console.log(err));
    })

    // Wait for market to open
    console.log("Waiting for market to open...");
    await waitForMarketOpen()
    console.log("Market now open")

    // Get bars for last 20 minutes, and set the running average
    // Waits until there are 20 minutes worth of bars to start
    // TODO: probably separate this function
    let twenty_bar_promise = new Promise((resolve, reject) => {
        const bar_checker = setInterval(async () => {
            await alpaca.getCalendar(Date.now()).then(async (response) => {
                const market_open = response[0].open; 
                console.log(`Market open: ${market_open}`)
                await alpaca.getBars('minute', ticker, {
                    start: market_open,
                }).then(response => {
                    const bars = response[ticker]; 
                    if(bars.length >= 20) {
                        clearInterval(bar_checker);
                        resolve();
                    }
                }).catch(err => console.log(err));
            })
        }, 60000)
    });
    
    console.log("Waiting for 20 minutes worth of bars");
    await twenty_bar_promise; 
    console.log("20 minutes worth of data received");

    // Rebalance portfolio every minute based on the running average
    const spin = setInterval(async () => {

        // Clear the last order so that we only have 1 hanging order
        if(this.last_order != null) {
            await alpaca.cancelOrder(last_order.id)
                .catch(err => console.log(err));
        }

        // See when market closes to we can prepare to sell beforehand
        let closing_time;
        let current_time; 

        await alpaca.getClock().then(response => {
            closing_time = new Date(response.next_close.substring(0, response.next_close.length - 6));
            current_time = new Date(response.timestamp.substring(0, response.timestamp.length - 6));
        }).catch(err => console.log(err));

        time_to_close = closing_time - current_time;

        if(time_to_close < (60000 * 15)) {
            // Close all positions when there's 15 minutes until market close
            console.log("Market closing in 15 minutes. Closing Positions");
            
            try {
                await alpaca.getPosition(ticker).then(async (response) => {
                    let position_quantity = response.qty;
                    await alpaca.createSellOrder(ticker, position_quantity, null, 'market')
                }).catch(err => console.log(err))
            } catch (err) { console.log(err); }
            clearInterval(spin);
            console.log("Sleeping for 15 minutes until market closes.")
            
            setTimeout(() => {
                // Run script again after market close for next trading day.
                run();
            }, 60000 * 15)

        } else {
            // Do the main jawn
            await rebalance();
        }
    }, 60000)

}

// This is the main jawn meat and bones baby
// Rebalances position every update
async function rebalance() {
    let position_quantity = 0;
    let position_value = 0;

    // Get our position, if there is any
    try {
        await alpaca.getPosition(ticker).then(response => {
            position_quantity = response.qty;
            position_value = response.market_value; 
            console.log(`You have ${position_quantity} shares of ${ticker} at $${position_value}..`)
        });
    } catch (err) { console.log(`No positions found - ${err}`)}

    // Get new updated price and running average (limit can be configured)
    let bars;
    await alpaca.getBars('minute', ticker, {limit: 20}).then(response => {
        bars = response[ticker];
    }).catch(err => console.log(err));

    let current_price = bars[bars.length - 1].c;
    running_average = 0;
    bars.forEach(bar => {
        running_average += bar.c;
    })
    running_average /= 20; 
    console.log(`Running average for ${ticker} - ${running_average}`)

    if(current_price > running_average) {
        // Sell our position(s) (if we have) if the price is higher than the running average
        if(position_quantity > 0) {
            console.log("Selling positions")
            await alpaca.createSellOrder(ticker, position_quantity, current_price, 'limit');
        }
        else console.log("No current positions. No action required. ")
    } else if (current_price < running_average) {
        // Determine optimal amount of shares based on portfolio and market data
        // TODO: Configure this
        let portfolio_value;
        let buying_power; 
        await alpaca.getAccount().then(response => {
            portfolio_value = response.portfolio_value;
            buying_power = response.buying_power;
        }).catch(err => console.log(err));
        
        let portfolio_share = (running_average - current_price) / current_price * 200; // Percentage of portfolio we should buy based on difference in price from running average
        let target_position_value = portfolio_value * portfolio_share;
        let amount_to_add = (target_position_value - position_value) / 5; //  Dollar representation of how much to buy - dividing by 5 so it doesn't use whole portfolio

        console.log(`Finding optimal amount - portfolio_share: ${portfolio_share} target_position_value: ${target_position_value} amount_to_add: ${amount_to_add}`)

        // Add to our position, constrained by our buying power, or, sell down to optimal amount of shares
        if(amount_to_add > 0) {
            if(amount_to_add > buying_power) amount_to_add = buying_power;
            let qty_to_buy = Math.floor(amount_to_add / current_price);

            console.log(`Buying ${qty_to_buy} shares of ${ticker} at limit $${current_price}...`)
            await alpaca.createBuyOrder(ticker, qty_to_buy, current_price, 'limit').then(response => {
                console.log("Shares purchased")
            }).catch(err => console.log(`Error with limit buy - ${err}`));
        } else {
            amount_to_add *= -1;
            let qty_to_sell = Math.floor(amount_to_add / current_price);
            if(qty_to_sell > position_quantity) qty_to_sell = position_quantity;

            console.log(`Selling ${qty_to_sell} shares of ${ticker} at limit $${current_price}...`)
            await alpaca.createSellOrder(ticker, qty_to_sell, current_price, 'limit').then(response => {
                console.log("Shares sold")
            }).catch(err => console.log(`Error with limit sell - ${err}`));
        }
    }
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
                    resolve();
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
        }, 60000)
    });    
}

module.exports = run;