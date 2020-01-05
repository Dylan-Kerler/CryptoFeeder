const {
    coinVolumes,
    coinSecondCache,
    coinOrders,
} = require("../dataStore");
const { calcMa } = require("../utils");

/* anomaly {
    type:   string
    group: string
    coin: string
    data: {
       range: number,
       timestamp: number,
       maRange: number,
    }
 */

/*
    Each time the order book updates check it

    Keep a 60 minute cache of the order book
    If it's been more than a minute since the last add then push the orderbook state to the 60 minute cache

    if the length of the cache is greater than or equal to 60
    then calculate the average buy/sell side in the cache
    then push this {buySide, sellSide} to an array of 200 hours containing these averages
    if the array is larger than 200 then remove the first element

    then calculate the moving average for this time period

    On new minute, check there are the size of the book is more than 200% greater then we have an anomaly
    take the size of the book and compare to how much larger it is than the past moving average

 */

/*
    dataStore:
    coinOrders: {
        lastCacheAdd: 0,
        lastUpdate: 0,
        orderCache60min: [],
        orderBookStates200: [],
    }
 */

const handleBookUpdate = (orderBook, coin) => {
    const now = new Date().getTime();
    const thisCoinOrders = coinOrders[coin];
    const anomalies = [];
    if (now - thisCoinOrders.lastCacheAdd > 60 /* seconds */ * 1000 /* milliseconds */) {
        console.log(orderBook);
        const orderBookState = calcTotalBuySellSide(orderBook);
        pushOrderBookStateToCache(orderBookState, now, coin);
        if (coinOrders[coin].orderBookCache60min.length >= 60 /* minutes */) {
            coinOrders[coin].orderBookStates200.push(orderBookState);
            if (coinOrders[coin].orderBookStates200.length > 200) {
                coinOrders[coin].orderBookStates200.splice(0, coinOrders[coin].orderBookStates200.length - 200)
            }
            coinOrders[coin].orderBookCache60min = [];
        }

        if (now - coinOrders[coin].lastUpdate > 60 /* seconds */ * 1000 /* milliseconds */) {
            const ma = calcBuySellMa(coinOrders[coin].orderBookStates200);
            anomalies.push(...isOrderBookAnomaly(ma, orderBookState, 1, coin));
            if (anomalies.length > 0) {
                coinOrders[coin].lastUpdate = now;
            }
        }
    }
    return anomalies;
};

const isOrderBookAnomaly = (ma, mostRecentState, multiplier, coin) => {
    const anomalies = [];
    const now = Math.floor(new Date().getTime() / 1000);
    if (mostRecentState.buySide > ma.buySide * multiplier) {
        anomalies.push({
            type: "OrderBookIncrease",
            group: "liquidity",
            isAnomaly: true,
            coin,
            exchange: "Binance",
            data: {
                isBuySide: true,
                total: mostRecentState.buySide,
                maTotal: ma.buySide,
                timestamp: now,
            },
        });
    }

    if (mostRecentState.sellSide > ma.sellSide * multiplier) {
        anomalies.push({
            type: "OrderBookIncrease",
            group: "liquidity",
            isAnomaly: true,
            coin,
            exchange: "Binance",
            data: {
                isBuySide: false,
                total: mostRecentState.sellSide,
                maTotal: ma.sellSide,
                timestamp: now,
            }
        });
    }

    return anomalies;
};


const pushOrderBookStateToCache = (orderBookState, now, coin) => {
    coinOrders[coin].orderBookCache60min.push(orderBookState);
    coinOrders[coin].lastCacheAdd = now;
};

const calcBuySellMa = orderBookStates => {
    const total = {buySide: 0, sellSide: 0};

    // Check length is greater than 0 before doing calculations, so we can avoid NaN results
    if (orderBookStates.length > 0) {
        for (const state of orderBookStates) {
            total.buySide += state.buySide;
            total.sellSide += state.sellSide;
        }

        return {
            buySide: total.buySide / orderBookStates.length,
            sellSide: total.sellSide / orderBookStates.length
        };
    }

    // In case there is nothing in the cache just return the zero values
    return total;
};

const calcTotalBuySellSide = orderBook => {
    const total = {buySide: 0, sellSide: 0};
    for (const bid of orderBook.bids) {
        total.buySide += parseFloat(bid.quantity);
    }

    for (const ask of orderBook.asks) {
        total.sellSide += parseFloat(ask.quantity);
    }

    return total;
};


module.exports = {
    handleBookUpdate
};