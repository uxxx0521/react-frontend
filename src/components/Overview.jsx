import React from "react";

const Overview = ({ symbol, price, change, changePercent, currency }) => {



  return (

    <>
      <div className="stock-overview">
        <span className="stock-symbol">{symbol}</span>
        <div className="stock-details">
          <span className="stock-price">
            ${price}
            <span className="stock-currency">{currency}</span>
          </span>
          <span className={`stock-change ${change >= 0 ? "positive" : "negative"}`}>
            {change}
            <span className="stock-change-percent">({changePercent})%</span>
          </span>
        </div>
      </div>
    </>




  );
}

export default Overview;