(this.webpackJsonptmp=this.webpackJsonptmp||[]).push([[0],{34:function(e,t,a){e.exports=a(76)},39:function(e,t,a){},40:function(e,t,a){},41:function(e,t,a){},42:function(e,t,a){},43:function(e,t,a){},44:function(e,t,a){},72:function(e,t){},76:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),r=a(4),m=a.n(r),l=(a(39),a(40),a(41),a(42),a(43),a(44),a(1)),c=a(8),i=a(7),s=a(31),u=a.n(s)()(""),d="UPDATE_PRICE",b=Object(i.a)((function(e,t){var a=Object(c.a)({},e);switch(t.type){case d:a[t.data.pair]=parseFloat(t.data.price.toFixed(0));break;default:console.log("Invalid action type for priceReducer, got: ",t.type)}return a}),{});u.on("NEW_BTC_PRICE",(function(e){console.log(e),b.dispatch({type:d,data:{pair:"BTCUSDT",price:parseFloat(e)}})}));var y=b,p=function(){var e=Object(n.useState)(y.getState().BTCUSDT),t=Object(l.a)(e,2),a=t[0],r=t[1],m=Object(n.useState)(!0),c=Object(l.a)(m,2),i=c[0],s=c[1];Object(n.useEffect)((function(){y.subscribe((function(){r((function(e){var t=y.getState().BTCUSDT;return s(t>=e),t}))}))}),[]);var u=i?"#26A83A":"red";return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{id:"title_text_div"}," ",o.a.createElement("h3",null,"cryptofeeder.com")," "),o.a.createElement("div",{id:"login_signup_button_div"},o.a.createElement("p",{style:{color:"white"}},"BTCUSDT: ",o.a.createElement("b",{style:{color:u}},"$",a))))},f="UPDATE_MIN_VOLUME",E="UPDATE_MIN_PRICE_INCREASE",h="UPDATE_MIN_ORDER_SIZE",v="UPDATE_COIN",T=Object(i.a)((function(e,t){var a=Object(c.a)({},e);switch(t.type){case f:a.minVolume=t.data;break;case E:a.minPriceIncrease=t.data;break;case h:a.minOrderSize=t.data;break;case v:a.coin=t.coin;break;default:console.log("ERROR! '",t.type,"' is not an action")}return a}),{minVolume:0,minPriceIncrease:0,minOrderSize:0,coin:"all"}),O=[{name:"Ethereum",symbol:"ETH"},{name:"Litecoin",symbol:"LTC"},{name:"Binance Coin",symbol:"BNB"},{name:"NEO",symbol:"NEO"},{name:"Bitcoin Cash",symbol:"BCC"},{name:"Gas",symbol:"GAS"},{name:"HSR",symbol:"HyperCash"},{name:"MCO",symbol:"Monaco"},{name:"WTC",symbol:"Waltonchain"},{name:"Loopring",symbol:"LRC"},{name:"Quantum",symbol:"QTUM"},{name:"YOYOW",symbol:"YOYO"},{name:"OmiseGo",symbol:"OMG"},{name:"0x",symbol:"ZRX"},{name:"Stratis",symbol:"STRAT"},{name:"SingularDTV",symbol:"SNGLS"},{name:"Ethos",symbol:"BQX"},{name:"Kyber Network",symbol:"KNC"},{name:"Funfair",symbol:"FUN"},{name:"SONM",symbol:"SNM"},{name:"Iota",symbol:"IOTA"},{name:"ChainLink",symbol:"LINK"},{name:"Verge",symbol:"XVG"},{name:"Salt",symbol:"SALT"},{name:"Moeda Loyalty Points",symbol:"MDA"},{name:"Metal",symbol:"MTL"},{name:"Substratum",symbol:"SUB"},{name:"Eos",symbol:"EOS"},{name:"Status",symbol:"SNT"},{name:"Ethereum Classic",symbol:"ETC"},{name:"Mithril",symbol:"MTH"},{name:"Enigma",symbol:"ENG"},{name:"District 0x",symbol:"DNT"},{name:"Zcash",symbol:"ZEC"},{name:"Bancor",symbol:"BNT"},{name:"Airswap",symbol:"AST"},{name:"Dash",symbol:"DASH"},{name:"OAX",symbol:"OAX"},{name:"Iconomi",symbol:"ICN"},{name:"Bitcoin Gold",symbol:"BTG"},{name:"Everex",symbol:"EVX"},{name:"Request Network",symbol:"REQ"},{name:"Viberate",symbol:"VIB"},{name:"Tron",symbol:"TRX"},{name:"Power Ledger",symbol:"POWR"},{name:"Ark",symbol:"ARK"},{name:"Ripple",symbol:"XRP"},{name:"Enjin",symbol:"ENJ"},{name:"Storj",symbol:"STROJ"},{name:"VeChain",symbol:"VEN"},{name:"Komodo",symbol:"KMD"},{name:"Ripio Credit Network",symbol:"RCN"},{name:"Nuls",symbol:"NULS"},{name:"Raiden Network",symbol:"RDN"},{name:"Monero",symbol:"XMR"},{name:"Agrello",symbol:"DLT"},{name:"Ambrosus",symbol:"AMB"},{name:"Basic Attention Token",symbol:"BAT"},{name:"Bitcoin Private",symbol:"BCPT"},{name:"Aeron",symbol:"ARN"},{name:"Genesis Vision",symbol:"GVT"},{name:"Blox",symbol:"CDT"},{name:"GXChain",symbol:"GXS"},{name:"Po.et",symbol:"POE"},{name:"Quantstamp",symbol:"QSP"},{name:"BitShares",symbol:"BTS"},{name:"ZCoin",symbol:"XCZ"},{name:"Lisk",symbol:"LSK"},{name:"Tierion",symbol:"TNT"},{name:"Etherparty",symbol:"FUEL"},{name:"Decentraland",symbol:"MANA"},{name:"Bitcoin Diamond",symbol:"BCD"},{name:"Ethereum",symbol:"ETH"},{name:"DigixDAO",symbol:"DGD"},{name:"Ethereum",symbol:"ETH"}],g=function(){var e=Object(n.useState)(""),t=Object(l.a)(e,2),a=t[0],r=t[1],m=Object(n.useState)([]),c=Object(l.a)(m,2),i=c[0],s=c[1];Object(n.useEffect)((function(){s([]);var e=a.toLowerCase(),t=!0,n=!1,o=void 0;try{for(var r,m=function(){var t=r.value;(t.name.toLowerCase().startsWith(e)||t.symbol.toLowerCase().startsWith(e))&&""!==a&&s((function(e){return e.length<5&&e.push(t),e}))},l=O[Symbol.iterator]();!(t=(r=l.next()).done);t=!0)m()}catch(c){n=!0,o=c}finally{try{t||null==l.return||l.return()}finally{if(n)throw o}}}),[a]);var u=i.map((function(e,t){return o.a.createElement(S,{name:e.name,symbol:e.symbol,key:t})})),d=Object(n.useState)("0px"),b=Object(l.a)(d,2),y=b[0],p=b[1];Object(n.useEffect)((function(){var e=document.getElementById("search_for_coin_input").getBoundingClientRect().width+"px";p(e)}),[]);var f={width:y,position:"fixed",border:"1px solid #D8D8D8",borderRadius:"10px",textAlign:"left",zIndex:20,overflow:"hidden",backgroundColor:"white"},E=Object(n.useState)(!1),h=Object(l.a)(E,2),v=h[0],T=h[1];return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",null,o.a.createElement("input",{id:"search_for_coin_input",placeholder:"Search for coin",value:a,onChange:function(e){r(e.target.value)},onClick:function(){return T(!0)}}),i.length>0&&v&&o.a.createElement("div",{style:f,onClick:function(){T(!1),r("")}},u)))},S=function(e){var t=Object(n.useState)(!0),a=Object(l.a)(t,2),r=a[0],m=a[1],c=r?"":"prediction_mouse_out";return o.a.createElement("div",{className:"search_prediction "+c,onMouseEnter:function(){m(!0)},onMouseLeave:function(){m(!1)},onClick:function(){T.dispatch({type:v,coin:e.symbol})}},e.name," (",e.symbol,")")},C=function(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(g,null))},x=function(e){var t=Object(n.useState)(e.defaultValue),a=Object(l.a)(t,2),r=a[0],m=a[1];Object(n.useEffect)((function(){T.dispatch({type:e.setttingsType,data:r})}),[r]);var c=function(){switch(e.dataType){case"volume":return"Minimum volume";case"price":return"Minimum price increase";case"liquidity":return"Minimum order size";default:return"Error! Invalid datatype, got '".concat(e.dataType,"'")}}();return o.a.createElement("div",{id:"min_".concat(e.dataType,"_slider_div")},o.a.createElement("h2",null,c,": ",o.a.createElement("b",{style:{color:"grey"}},r)),o.a.createElement("input",{type:"range",min:"0",max:e.max,step:e.step,id:"test",onChange:function(e){m(e.target.value)},value:r}),o.a.createElement("div",null,o.a.createElement("strong",{className:"min_value"},"".concat(e.minText)),o.a.createElement("strong",{className:"max_value"},"".concat(e.maxText))))},_=function(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(x,{dataType:"volume",setttingsType:f,max:"1000000",step:"1",minText:"$0",maxText:"$1,000,000",defaultValue:"0"}),o.a.createElement(x,{dataType:"price",setttingsType:E,max:"50",step:"1",minText:"0%",maxText:"50%",defaultValue:"0"}),o.a.createElement(x,{dataType:"liquidity",setttingsType:h,max:"3000000",step:"1",minText:"$0",maxText:"$3,000,000",defaultValue:"0"}))},j=a(33),N=Object(n.createContext)(),B=Object(n.createContext)(Date.now()),D=Object(n.createContext)(T.getState()),M=Object(n.createContext)(y.getState().BTCUSDT),A=function(e){var t=e.anomaly,a=e.dataType,r="",m=Object(n.useContext)(D),l=Object(n.useContext)(M),c=Math.abs(Object(n.useContext)(B)-1e3*t.data.timestamp),i=c>12e4?c>36e5?"":"("+Math.floor(c/1e3/60)+" minutes ago)":"("+Math.floor(c/1e3)+" seconds ago)",s=1e3*t.data.timestamp-t.data.limitTimestamp,u=s>12e4?Math.abs(Math.floor(s/1e3/60))+" minutes ":Math.abs(Math.floor(s/1e3))+" seconds ";if(t.coin===m.coin||"all"===m.coin)switch(t.type){case"volumeAnomaly":t.data.total*l>=m.minVolume&&(r=o.a.createElement("p",{className:"".concat(a,"_text")},"$",Intl.NumberFormat().format((t.data.total*l).toFixed(2))+" "," worth of ",t.coin+" ","was ",t.data.isBuyVolume?"bought ":"sold "," on ",t.exchange+" ","in the past ",u," -"," "+(100*(t.data.total/t.data.hourlyMa200-1)).toFixed(2)+"% "," higher than the 200 hourly average.",i));break;case"anomalyPriceRange":100*t.data.change>=m.minPriceIncrease&&(r=o.a.createElement("p",{className:"".concat(a,"_text")},t.coin," just ",t.data.positive?"pumped ":"dumped ",(100*t.data.change).toFixed(2),"% in the past ",u," -"," "+(100*(t.data.range/t.data.maRange-1)).toFixed(2)+"%"," higher than the 200 hourly average"," "+i));break;case"OrderBookIncrease":t.data.total*l>=m.minOrderSize&&(r=o.a.createElement("p",{className:"".concat(a,"_text")},"$",Intl.NumberFormat().format((t.data.total*l).toFixed(0))," ",t.data.isBuySide?"buy ":"sell"," wall for ",t.coin+" ","appeared ",i," on ",t.exchange," - A ",(100*(t.data.total/t.data.maTotal-1)).toFixed(2),"% increase from the 200 hourly average"))}var d=t.data.isBuySide||t.data.isBuyVolume||t.data.positive?"enter_buy_data":"enter_sell_data";return r?o.a.createElement("div",{id:"".concat(a,"_data_1"),className:"data_box ".concat(a,"_box ").concat(d)},r,o.a.createElement("p",{className:"data_timestamp"},new Date(1e3*t.data.timestamp).toGMTString())):o.a.createElement(o.a.Fragment,null)},R=function(e,t){var a;(a=e[t.type]).push.apply(a,Object(j.a)(t.data));return e[t.type].length>500&&e[t.type].shift(),JSON.parse(JSON.stringify(e))},I=function(e){var t=Object(n.useContext)(N),a=e.dataType,r=t[e.dataType].map((function(e,t){return o.a.createElement(A,{dataType:a,anomaly:e,key:t})}));return o.a.createElement("div",{id:"".concat(a,"_data_div")},o.a.createElement("h1",null,"".concat(a.slice(0,1).toUpperCase()).concat(a.slice(1))),o.a.createElement("div",null,r.reverse()))},w=function(){var e=Object(n.useReducer)(R,{volume:[],price:[],liquidity:[]}),t=Object(l.a)(e,2),a=t[0],r=t[1],m=Object(n.useState)(Date.now()),c=Object(l.a)(m,2),i=c[0],s=c[1],d=Object(n.useState)(T.getState()),b=Object(l.a)(d,2),p=b[0],f=b[1],E=Object(n.useState)(y.getState().BTCUSDT),h=Object(l.a)(E,2),v=h[0],O=h[1],g=["volume","price","liquidity"];Object(n.useEffect)((function(){fetch("".concat("","/api/little_cache")).then((function(e){return e.json().then((function(e){Object.keys(e).forEach((function(t){g.includes(t)&&r({type:t,data:e[t]})}))}))})),u.on("NEW_ANOMALY",(function(e){r({type:e.group,data:[e]})}))}),[]),Object(n.useEffect)((function(){var e=T.subscribe((function(){f(T.getState())})),t=y.subscribe((function(){O(y.getState().BTCUSDT)}));return function(){e(),t()}}),[]),Object(n.useEffect)((function(){var e=setInterval((function(){s(Date.now())}),1e3);return function(){return clearInterval(e)}}),[]);var S=g.map((function(e,t){return o.a.createElement(I,{dataType:e,key:t})}));return o.a.createElement(o.a.Fragment,null,o.a.createElement(D.Provider,{value:p},o.a.createElement(M.Provider,{value:v},o.a.createElement(B.Provider,{value:i},o.a.createElement(N.Provider,{value:a},S)))))};m.a.render(o.a.createElement(p,null),document.getElementById("header_div")),m.a.render(o.a.createElement(C,null),document.getElementById("top_bar_div")),m.a.render(o.a.createElement(_,null),document.getElementById("sliders_div")),m.a.render(o.a.createElement(w,null),document.getElementById("data_div"))}},[[34,1,2]]]);
//# sourceMappingURL=main.ad018a87.chunk.js.map