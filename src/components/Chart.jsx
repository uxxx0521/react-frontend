import React, { useState } from "react";
import { mockHistoricalData } from "../constants/mock";
import { chartConfig } from "../constants/config"
import {
  convertUnixTimestampToDate,
  convertDateToUnixTimestamp,
  createDate,
} from "../helpers/data-helper"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import ChartFilter from "./ChartFIlter";


const Chart = () => {
  const [data, setData] = useState(mockHistoricalData);
  const [filter, setFilter] = useState("1W");

  const formatData = () => {
    return data.c.map((item, index) => {
      return {
        value: item.toFixed(2),
        date: convertUnixTimestampToDate(data.t[index])
      };
    });
  }



  return (
    <>
      <div className="chart">
        <ul className="stock-filter-button-list">
          {Object.keys(chartConfig).map((item) => {
            return <li key={item} className="stock-filter-button-item">
              <ChartFilter
                text={item}
                active={filter === item}
                onClick={() => {
                  setFilter(item);
                }} />
            </li>
          })}
        </ul>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={formatData(data)}>

            <defs>
              <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(199 210 254)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgb(199 210 254)" stopOpacity={0} />
              </linearGradient>

            </defs>

            <Area
              type="monotone"
              dataKey="value"
              stroke="#312e81"
              fillOpacity={1}
              strokeWidth={0.5}
              fill="url(#chartColor)">
            </Area>

            <Tooltip />
            <XAxis dataKey={"date"}></XAxis>
            <YAxis domain={["dataMin", "dataMax"]}></YAxis>
          </AreaChart>
        </ResponsiveContainer>

      </div>
    </>
  );
}

export default Chart;