import React, { useState } from "react";
import Button_Header from '../Button/Button_header'
import Dashboard from './Stock_dashboard';
import Overview from "./Overview";
import { mockCompanyDetails } from "../constants/mock";
import StockContext from "../context/StockContext";
function Stock() {


  const [stockDetails, setStockDetails] = useState({ name: "Face book" });
  const [stockSymbol, setStockSymbol] = useState("AMZN");
  const [overviewData, setOverviewData] = useState({
    price: 0,
    change: 0,
    changePercent: 0,
    currency: "",
  });

  const handleDataFromChild = (data) => {
    setStockDetails(data); // Update state with data from the child
  };
  const handleOverviewDataFromChild = (data) => {
    setOverviewData(data);
  };

  return (
    <>
      <div className="app-stock-section">
        <div>
          <StockContext.Provider value={{ stockSymbol, setStockSymbol }}>
            <div className="stock-top-section">
              <div className="stock-title-section">
                <h1 className="stock-title">Stock</h1>
                <h1 className="stock-company-name"> {stockDetails.name}</h1>
              </div>
              <Overview symbol={stockSymbol} price={overviewData.pc} change={overviewData.d} changePercent={overviewData.dp} currency={stockDetails.currency} />
            </div>
            <Dashboard onSendData={handleDataFromChild}
              onSendOverviewData={handleOverviewDataFromChild} />
          </StockContext.Provider>
        </div>
        <div>


        </div>
      </div >
    </>


  );

}

export default Stock;