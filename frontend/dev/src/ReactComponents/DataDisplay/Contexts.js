import {createContext} from "react";
import settingsStore from "../Store/Settings";
import priceStore from "../Store/Price";

const AnomaliesContext = createContext();
const TimeContext = createContext(Date.now());
const SettingsContext = createContext(settingsStore.getState());
const PriceContext = createContext(priceStore.getState()["BTCUSDT"]);

export {
    AnomaliesContext,
    TimeContext,
    SettingsContext,
    PriceContext
}