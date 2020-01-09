import React, {useContext} from "react";
import {PriceContext, SettingsContext, TimeContext} from "./Contexts";

const ParsedText = ({anomaly, dataType}) => {
    let element = "";
    const settings = useContext(SettingsContext);
    const price = useContext(PriceContext);
    const timePassed = useContext(TimeContext) - anomaly.data.timestamp * 1000;
    const movingTimeString = timePassed > 120 * 1000 ? timePassed > 60 * 1000 * 60 ? ""
        : "(" + Math.floor(timePassed / 1000 / 60) + " minutes ago)"
        : "(" + Math.floor(timePassed / 1000) + " seconds ago)";

    const anomalyTimeRange = anomaly.data.timestamp * 1000 - anomaly.data.limitTimestamp;
    const anomalyTimeRangeString = anomalyTimeRange > 120 * 1000 ? Math.floor(anomalyTimeRange / 1000 / 60) + " minutes " : Math.floor(anomalyTimeRange / 1000) + " seconds ";

    if (anomaly.coin === settings.coin || settings.coin === "all") {
        switch (anomaly.type) {
            case "volumeAnomaly":
                if (anomaly.data.total * price >= settings.minVolume) {
                    element = <p className={`${dataType}_text`}>
                        ${Intl.NumberFormat().format((anomaly.data.total * price).toFixed(2)) + " "} worth of {anomaly.coin + " "}
                        was {anomaly.data.isBuyVolume ? "bought " : "sold "} on {anomaly.exchange + " "}
                        in the past {anomalyTimeRangeString} -
                        {" " + ((anomaly.data.total / anomaly.data.hourlyMa200 - 1) * 100).toFixed(2) + "% "} higher than the 200 hourly average.
                        {movingTimeString}
                    </p>;
                }
                break;
            case "anomalyPriceRange":
                if (anomaly.data.change * 100 >= settings.minPriceIncrease) {
                    element = <p className={`${dataType}_text`}>
                        {anomaly.coin} just {anomaly.data.positive ? "pumped " : "dumped "}
                        {(anomaly.data.change * 100).toFixed(2)}%
                        in the past {anomalyTimeRangeString} -
                        {" " + ((anomaly.data.range / anomaly.data.maRange - 1) * 100).toFixed(2) + "%"} higher than the 200 hourly average
                        {" " + movingTimeString}
                    </p>
                }
                break;

            case "OrderBookIncrease":
                console.log(anomaly)
                if (anomaly.data.total >= settings.minOrderSize) {
                    element = <p className={`${dataType}_text`}>
                        ${Intl.NumberFormat().format(anomaly.data.total)} {anomaly.data.isBuySide ? "buy " : "sell"} wall for {anomaly.coin + " "}
                        appeared {movingTimeString} on {anomaly.exchange} - A {((anomaly.data.total / anomaly.data.maTotal - 1) * 100).toFixed(2)}% increase
                        from the 200 hourly average
                    </p>
                }
                break;
        }
    }

    let enterClassName = "enter_sell_data";
    if (anomaly.data.isBuySide || anomaly.data.isBuyVolume || anomaly.data.positive) {
        enterClassName = "enter_buy_data";
    }

    return (
        (() =>
                element ?
                    <div id={`${dataType}_data_1`} className={`data_box ${dataType}_box ${enterClassName}`}>
                        {element}
                        <p className="data_timestamp">{new Date(anomaly.data.timestamp * 1000).toGMTString()}</p>
                    </div>
                    :
                    <React.Fragment/>
        )()
    );
};

export default ParsedText;