const { subscribeToCandles, subscribeToAggTrades, getPairs, initialisePreviousCandles, subscribeToOrderBooks } = require("./backend/subcriptions");
const { updateSecondData, handleNewCandle, handleOrderBook } = require("./backend/DataHandlers/generic");
const { recentEventCache, anomalyEmitter } = require("./backend/dataStore");

getPairs("BTC").then(async ({pairs, basePair}) => {
    await initialisePreviousCandles(200, "1h", pairs, "BTC");
    subscribeToOrderBooks(basePair, pairs, handleOrderBook);
    subscribeToAggTrades(basePair, pairs, updateSecondData);
    subscribeToCandles(basePair, pairs, "1h", handleNewCandle);
});

const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const path = require("path");
const PORT = 8080;
http.listen(PORT, () => console.log("Server listening on port ", PORT));

// dev
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("/", (req, res) => {
    // noinspection JSUnresolvedVariable
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});
const spliceEventCache = (limit = 30, size = "LITTLE") => {
    /// Do a deep copy here (Object.assign and "..." spread operator only shallow copy)
    const sizedEventCache = JSON.parse(JSON.stringify(recentEventCache));
    Object.keys(sizedEventCache).forEach(key => {
        if (key !== "limit") {
            const length = sizedEventCache[key].length;
            if (length > limit) {
                size === "LITTLE"   ? sizedEventCache[key].splice(0, length - limit)
                : size === "BIG"    ? sizedEventCache[key].splice(length - limit, length)
                : process.exit(`Invalid 'size' type, expected 'LITTLE' or 'BIG', instead got: ${size}`);
            }
        }

    });
    return sizedEventCache;

};

/// Send the small cache first for better performance
app.get("/api/little_cache", (req, res) => {
    const littleEventCache = spliceEventCache(30, "LITTLE");
    res.json(littleEventCache);
});

/// Then send the bigger cache after the smaller cache
app.get("/api/big_cache", (req, res) => {
    const bigEventCache = spliceEventCache(30, "BIG");
    res.json(bigEventCache);
});

/// Websockets
const Binance = require("binance-api-node").default;
let lastUpdate = Date.now();
Binance().ws.trades('BTCUSDT', trade => {
    if (Date.now() - lastUpdate > 1000) { //update every 1 second
        io.emit("NEW_BTC_PRICE", trade.price);
        lastUpdate = Date.now();
    }
});

io.on('connection', function(socket) {
    console.log("A user connected")
});

anomalyEmitter.on("NEW_ANOMALY", data => {
    console.log("emitted", data);
    io.emit("NEW_ANOMALY", data.anomaly);
});

