import React from "react";

const Details = ({ details }) => {
  const detailsList = {
    name: "Name",
    country: "Country",
    currency: "Curremcy",
    exchange: "Exchange",
    ipo: "IPO Date",
    marketCapitalization: "Market Capitalization",
    finnhubIndustry: "Industry",
  };

  const converMillionToBillion = (number) => {

    return (number / 1000).toFixed(2);
  }

  return (
    <>
      <div>
        <ul className="details-list">
          {Object.keys(detailsList).map((item) => {

            return <li key={item} className="details-item">
              <span className="details-left">{detailsList[item]}</span>
              <span className="detao;s-right">
                {item === "marketCapitalization"
                  ? `${converMillionToBillion(details[item])}B`
                  : details[item]}
              </span>
            </li>
          })}

        </ul>
      </div>
    </>

  );
}

export default Details;

