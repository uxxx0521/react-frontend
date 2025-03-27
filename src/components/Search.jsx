import React, { useState, useEffect } from "react";
import SearchResults from "./SearchResult";
import { searchSymbols } from "../api/stock-api";

const Search = () => {
  const [input, setInput] = useState("");
  const [bestMatches, setBestMatches] = useState([]);
  const [resultsVisible, setResultsVisible] = useState(false);

  const clear = () => {
    setInput("");
    setBestMatches([]);

  };

  const updateBestMatches = async () => {
    try {
      if (input) {
        const searchResults = await searchSymbols(input);
        const result = searchResults.result;
        setBestMatches(result);
      }
    } catch (error) {
      setBestMatches([]);
      console.log(error);
    }
  }

  useEffect(() => {

    updateBestMatches();

  }, [input])


  return (
    <>
      <div className="stock-search-section">
        <div className="search-container">
          <input
            type="text"
            value={input}
            className="stock-search-input"
            placeholder="Search stock"
            onChange={(event) => {
              setInput(event.target.value);

            }}
            onFocus={() => setResultsVisible(bestMatches.length > 0)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateBestMatches();
              }
            }}
          />
          <button className="stock-search-button" onClick={updateBestMatches}>Search</button>
          <button className="stock-clear-button" onClick={clear}>Clear</button>

          {input && bestMatches.length > 0 ? (

            <div className="search-results-dropdown">
              <SearchResults
                results={bestMatches}
                onClose={() => setInput("")}
              />
            </div>
          ) : null}
        </div>

      </div >
    </>
  );

}

export default Search;