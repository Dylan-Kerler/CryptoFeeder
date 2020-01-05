const {
    coinVolumes,
    coinSecondCache,
} = require("../dataStore");
const { calcMa } = require("../utils");

/* anomaly {
    type:   string
    group: string
    coin: string,
    isAnomaly: true
    data: {
       range: number,
       timestamp: number,
       maRange: number,
    }
 */

const checkVolumeSeconds = (coin, mostRecentTrade) => {
    const volumeAnomalies = [];
    const timeNow = Math.floor(mostRecentTrade.eventTime / 1000);
    const second = {
        ...tallyVolumeCache(coinSecondCache[coin].secondCache),
        second: timeNow
    };

    pushVolumeSecond(second, coin);
    const MULTIPLIER = 2;
    const { isBuyVolume, isSellVolume } = isAnomalyVolume(coin, MULTIPLIER);
    if ((isBuyVolume || isSellVolume)
            && timeNow - coinVolumes[coin].lastUpdate > 60 /* seconds */) {
        coinVolumes[coin].lastUpdate = timeNow;
        volumeAnomalies.push({
            type: "volumeAnomaly",
            group: "volume",
            isAnomaly: true,
            coin,
            exchange: "Binance",
            data: {
                ...calcSmallestTimeFrameToSatisfyLimitVolume(coinVolumes[coin].seconds, coin, MULTIPLIER, isBuyVolume),
                hourlyMa200: coinVolumes[coin].hourlyMa200
            }
        });
    }

    return volumeAnomalies;
};

const tallyVolumeCache = (series) => {
    const [BUY, SELL] = [false, true]; // {maker: false} implies a market buy (the maker was the seller)
    const second = {buyVolume: 0, sellVolume: 0};
    for (const tmpTrade of series) {
        tmpTrade.maker === BUY ? second.buyVolume += parseFloat(tmpTrade.quantity) * parseFloat(tmpTrade.price)
            : second.sellVolume += parseFloat(tmpTrade.quantity) * parseFloat(tmpTrade.price);
    }
    return second;
};

const pushVolumeSecond = (second, coin) => {
    coinVolumes[coin].seconds.push(second);

    // Add the tallied cache totals to the current totals and deduct the oldest second totals from the current total
    coinVolumes[coin].totalBuy += second.buyVolume;
    coinVolumes[coin].totalSell += second.sellVolume;
    if (coinVolumes[coin].seconds.length > 30 /* minutes */ * 60 /* seconds */) {
        const secondRemoved = coinVolumes[coin].seconds.shift();
        coinVolumes[coin].totalBuy -= secondRemoved.buyVolume;
        coinVolumes[coin].totalSell -= secondRemoved.sellVolume;
    }
};

// If the total buy volume is more than the {hourly ma volume * multiplier} then anomaly is found
const isAnomalyVolume = (coin, multiplier) => {
    if (coinVolumes[coin].totalBuy / coinVolumes[coin].hourlyMa200 > multiplier) {
        return {isBuyVolume: true, isSellVolume: false};
    } else if (coinVolumes[coin].totalSell / coinVolumes[coin].hourlyMa200 > multiplier) {
        return {isBuyVolume: false, isSellVolume: true};
    }

    return {isBuyVolume: false, isSellVolume: false};
};

const calcSmallestTimeFrameToSatisfyLimitVolume = (series, coin, multiplier, isBuyVolume) => {
    let total = 0;
    for (let i = series.length - 1; i >= 0; i--) {
        total += isBuyVolume ? series[i].buyVolume : series[i].sellVolume;
        if (total >=  coinVolumes[coin].hourlyMa200 * multiplier) {
            return { total, timestamp: Math.floor(Date.now() / 1000), limitTimestamp: series[i].second * 1000, isBuyVolume };
        }
    }

    // Should never reach here
    throw Error("Could not satisfy limit despite the totalBuyVolume being greater than than the ma times the multiplier")
};

const handleVolumeCandle = (candle, coin) => {
    const volume = parseFloat(candle.volume);
    coinVolumes[coin].hourly200Cache.push(parseFloat(volume));
    if (coinVolumes[coin].hourly200Cache.length > 200) {
        coinVolumes[coin].hourly200Cache.shift();
    }
    const ma200 = calcMa(coinVolumes[coin].hourly200Cache);
    coinVolumes[coin].hourlyMa200 = ma200;
};

module.exports = {
    checkVolumeSeconds,
    handleVolumeCandle
};