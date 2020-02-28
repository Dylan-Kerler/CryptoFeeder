import React from "react";
import SearchForCoin from "./SearchForCoin";
import Button from "../Utils/Button/Button";

const TopBar = () => {
    return (
        <React.Fragment>
            <SearchForCoin/>
            <div id="referrals-box">
                <p style={{margin: "auto 15px auto auto"}}>Want to <span style={{color: "#23b510"}}>SAVE 30%</span> on trading fees?</p>
                <Button 
                    backgroundColor="#f3ba2f"
                    textColor="#212833"
                    text="Trade on Binance"
                    style={{margin: "auto"}}
                    onClick={() => console.log("clicked")}
                />
            </div>
        </React.Fragment>
    );
};


export default TopBar;