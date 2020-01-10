import React, {useEffect, useReducer, useContext, useState, createContext} from "react";
import socket from "../Socket";
import settingsStore from "../Store/Settings";
import priceStore from "../Store/Price";
import {AnomaliesContext, TimeContext, SettingsContext, PriceContext} from "./Contexts";
import ParsedText from "./ParsedText";
import URL from "../Store/URL";

const anomaliesReducer = (state, action) => {
    state[action.type].push(...action.data);
    const LIMIT = 500;
    if (state[action.type].length > LIMIT) {
        state[action.type].shift();
    }

    // Do a deep copy here, so that on next comparison, react knows that the state has changed ({} !== {})
    return JSON.parse(JSON.stringify(state));
};

const DataDisplay = () => {
    const initialState = {
        "volume":       [],
        "price":        [],
        "liquidity":    [],
    };

    const [anomalies, dispatchAnomalies] = useReducer(anomaliesReducer, initialState);
    const [now, setNow] = useState(Date.now());
    const [settings, setSettings] = useState(settingsStore.getState());
    const [price, setPrice] = useState(priceStore.getState()["BTCUSDT"]);
    const dataTypes = ["volume", "price", "liquidity"];


    // Initialise the anomalies
    useEffect(() => {
        //Hit the cache api and set the initial state
        fetch(`${URL}/api/little_cache`).then(res => res.json().then(recentEventCache => {
            Object.keys(recentEventCache).forEach(key => {
                if (dataTypes.includes(key)) {
                    dispatchAnomalies({type: key, data: recentEventCache[key]});
                }
            })
        }));

        //Subscribe to anomalies to push to anomalies state
        socket.on("NEW_ANOMALY", (anomaly) => {
            dispatchAnomalies({type: anomaly.group, data: [anomaly]});
        });
    }, []);

    // Subscribe to stores
    useEffect(() => {
        const settingStoreUnsubscribe = settingsStore.subscribe(() => {
            setSettings(settingsStore.getState());
        });

        const priceStoreUnsubscribe = priceStore.subscribe(() => {
            setPrice(priceStore.getState()["BTCUSDT"]);
        });

        return () => {
            settingStoreUnsubscribe();
            priceStoreUnsubscribe();
        }
    }, []);

    // Start setNow interval
    useEffect(() => {
        const threadId = setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => clearInterval(threadId);
    }, []);

    const dataDivs = dataTypes.map((type, index) => <DataDiv dataType={type} key={index}/>);
    return (
        <React.Fragment>
            <SettingsContext.Provider value={settings}>
                <PriceContext.Provider value={price}>
                    <TimeContext.Provider value={now}>
                        <AnomaliesContext.Provider value={anomalies}>
                            {dataDivs}
                        </AnomaliesContext.Provider>
                    </TimeContext.Provider>
                </PriceContext.Provider>
            </SettingsContext.Provider>
        </React.Fragment>
    );
};

const DataDiv = (props) => {
    const anomalies = useContext(AnomaliesContext);
    const dataType = props.dataType;

    // Loop through all anomalies of that type and parse the anomaly into text
    const relevantAnomalies = anomalies[props.dataType].map((anomaly, index) => {
        return (
            <ParsedText dataType={dataType} anomaly={anomaly} key={index}/>
        );
    });

    return (
        <div id={`${dataType}_data_div`}>
            <h1>{`${dataType.slice(0,1).toUpperCase()}${dataType.slice(1)}`}</h1>
            <div>
                { //Anomalies are organised with oldest -> newest (needs to be reversed)
                  relevantAnomalies.reverse() }
            </div>
        </div>
    )
};

export default DataDisplay;
