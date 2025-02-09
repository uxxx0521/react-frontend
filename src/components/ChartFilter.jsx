import React from "react";

const ChartFilter = ({ text, active, onClick }) => {


  return (
    <>
      <div className="stock-filter-button-section">
        <button onClick={onClick}
          className={active ? "button-active" : "button-inactive"}>{text}</button>
      </div >
    </>
  );
}

export default ChartFilter;