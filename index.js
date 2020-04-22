const cron = require('node-cron');
const alpaca_api = require('./api/alpaca.js');
const polygon_api = require('./api/polygon.js');

// Scripts 
const mean_reversion = require('./scripts/mean-reversion.js');
const mean_reversion_with_multiple = require('./scripts/mean-reversion-with-multiple.js')



// -------- Runnner ---------
mean_reversion_with_multiple();



