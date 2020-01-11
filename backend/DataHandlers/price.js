const {
    coinPrices,
    coinSecondCache,
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

// Returns an array of anomalies (empty if none are found)
const checkPriceSeconds = (coin, mostRecentTrade) => {
    const anomalyArray = [];
    const second = convertCacheToSecond(coinSecondCache[coin].secondCache);
    coinPrices[coin].seconds.push(second);
    if (coinPrices[coin].seconds.length > 60 * 30) {
        coinPrices[coin].seconds.shift();
    }

    const maRange = coinPrices[coin].hourlyMa200;
    const anomalyRange = isAnomalyPriceRange(coinPrices[coin].seconds, maRange); // returns the range size

    const maClose = coinPrices[coin].maClose;
    const anomalyMaCross = isAnomalyMaCross(coinPrices[coin].seconds, maClose);

    const recentTradeTime = Math.floor(Date.now() / 1000);
    if (anomalyMaCross && recentTradeTime - coinPrices[coin].lastUpdate > 60) {
        coinPrices[coin].lastUpdate = recentTradeTime;
        anomalyArray.push({
            type: "anomalyMaCross",
            group: "price",
            isAnomaly: true,
            coin,
            data: {...anomalyMaCross, maClose, timestamp: recentTradeTime}
        });
    }

    if (anomalyRange && recentTradeTime - coinPrices[coin].lastUpdate > 30 /* minutes */ * 60 /* seconds */) {
        coinPrices[coin].lastUpdate = recentTradeTime;
        anomalyArray.push({
            type: "anomalyPriceRange",
            group: "price",
            isAnomaly: true,
            coin,
            data: { ...anomalyRange, maRange, timestamp: recentTradeTime }
        });
    }

    return anomalyArray;
};

const convertCacheToSecond = (series) => {
    const range = { high: 0, low: 0, timestamp: Date.now() };
    for (trade of series) {
        const price = parseFloat(trade.price);
        if (price > range.high) {
            range.high = price;
        }

        if (price < range.low || range.low === 0) {
            range.low = price;
        }
    }
    return range;
};

const isAnomalyMaCross = (series, ma) => {
  const isBelow = series[0].high < ma;
  const mostRecentClose = series[series.length - 1].close;
  const hasCrossedMa = isBelow ? mostRecentClose > ma : mostRecentClose < ma;

  return hasCrossedMa;
};

/// Checks  if the range in the past n minutes is larger than the limit
/// Returns the range size OR false if it is not greater than
const isAnomalyPriceRange = (series, limit) => {
    const {high, low} = series[series.length - 1];
    for (let i = series.length - 1; i >= 0; i--) {
        const positiveRange = high - series[i].low;
        const negativeRange = series[i].high - low;
        const ONE_SATOSHI = 0.00000001;
        if (positiveRange > limit && positiveRange > ONE_SATOSHI * 5) {
            return {
                positive: true,
                change: positiveRange / series[i].high,
                range: positiveRange,
                limitTimestamp: series[i].timestamp
            }
        }

        else if (negativeRange > limit && negativeRange > ONE_SATOSHI * 5) {
            return {
                positive: false,
                change: negativeRange / series[i].high,
                range: negativeRange,
                limitTimestamp: series[i].timestamp
            }
        }
    }

    return false;
}

const indexes = {};
const handlePriceCandle = (candle, coin) => {
    const range = Math.abs(parseFloat(candle.high) - parseFloat(candle.low));
    coinPrices[coin].hourly200Cache.push(range);
    if (coinPrices[coin].hourly200Cache.length > 200) {
        coinPrices[coin].hourly200Cache.shift();
    }

    // calculates the moving average of all the candle ranges in the cache
    const ma200 = calcMa(coinPrices[coin].hourly200Cache);
    coinPrices[coin].hourlyMa200 = ma200;
    if (indexes["coin"] % 24 === 0) {
        coinPrices[coin].dailyMa50Cache.push(parseFloat(candle.close));
        const maClose50 = calcMa(coinPrices[coin].dailyMa50Cache);
        coinPrices[coin].dailyMa50 = maClose50;
    }
    indexes[coin] = indexes[coin] + 1;
};

module.exports = {
    handlePriceCandle,
    checkPriceSeconds
};