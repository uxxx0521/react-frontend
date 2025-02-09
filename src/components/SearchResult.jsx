import React, { useContext, useEffect, useRef } from "react";
import StockContext from "../context/StockContext";


const SearchResults = ({ results, onClose }) => {
  const { setStockSymbol } = useContext(StockContext);
  const resultsRef = useRef();

  // Detect clicks outside the list and close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        onClose(); // Call the parent function to hide the list
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);


  return (
    <>
      <ul className="search-results-list" ref={resultsRef}>
        {results.map((item) => {
          return <li onClick={() => {
            setStockSymbol(item.symbol);
            onClose(); // Close the list after selection
          }}
            key={item.symbol}
            className="search-results-item">
            <span className="search-results-symbol">{item.symbol}</span>
            <span className="search-results-description">{item.description}</span>

          </li >;
        })}

      </ul >




    </>

  );


}

export default SearchResults;