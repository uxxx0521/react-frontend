import React, { useContext, useState, useEffect } from "react";
import Search from "./Search";
import Details from "./Details";
import Chart from "./Chart"
import StockContext from "../context/StockContext";
import { fetchQuote, fetchStockDetails } from "../api/stock-api";

const Dashboard = ({ onSendData, onSendOverviewData }) => {
  const { stockSymbol } = useContext(StockContext);

  const [stockDetails, setStockDetails] = useState({});
  const [quote, setQuote] = useState({});

  useEffect(() => {
    const updateStockDetails = async () => {
      try {
        const result = await fetchStockDetails(stockSymbol);
        setStockDetails(result);
      } catch (error) {
        setStockDetails({});
        console.log(error);
      }

    };
    const updateStockOverview = async () => {
      try {
        const result = await fetchQuote(stockSymbol);
        setQuote(result);
      } catch (error) {
        setQuote({});
        console.log(error);
      }
    };

    updateStockDetails();
    updateStockOverview();
  }, [stockSymbol]);

  // Send data to parent component
  useEffect(() => {
    const sendDataToParent = () => {

      if (stockDetails.name) { // Ensure stockDetails.name is valid
        onSendData(stockDetails);     // Call the parent function with the data
      }
    };
    sendDataToParent();
  }, [stockDetails.name]);


  useEffect(() => {
    const sendDataToParent = () => {
      const data = quote;
      if (data) { // Ensure stockDetails.name is valid
        onSendOverviewData(data);     // Call the parent function with the data
      }
    };
    sendDataToParent();
  }, [quote]);


  return (
    <>
      < div >

        <Search />
        <Chart />
        <Details details={stockDetails} />

      </div >

    </>
  );




};
export default Dashboard;