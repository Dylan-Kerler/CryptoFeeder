import React, {useEffect, useState} from "react";
import priceStore from "./Store/Price";

const Header = () => {
    const [btcPrice, setBtcPrice] = useState(priceStore.getState()["BTCUSDT"]);
    const [isBuy, setIsBuy] = useState(true);
    useEffect(() => {
        priceStore.subscribe(() => {
            setBtcPrice(prevBtcPrice => {
                const newBtcPrice = priceStore.getState()["BTCUSDT"];
                setIsBuy(newBtcPrice >= prevBtcPrice);
                return newBtcPrice;
            });
        });
    }, []);

    const priceColour = isBuy ? "#26A83A" : "red";
    return (
        <React.Fragment>
            <div id="title_text_div"> <h3>cryptofeeder.com</h3> </div>
            <div id="login_signup_button_div">
                <p style={{color: "white"}}>BTCUSDT: <b style={{color: priceColour}}>${btcPrice}</b></p>
            </div>
        </React.Fragment>
    )
};

export default Header;