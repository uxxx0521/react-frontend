const basePath = "https://finnhub.io/api/v1";

export const searchSymbols = async (query) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `${basePath}/search?q=${query}&token=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`
    throw new Error(message);
  }
  return await response.json();
};

export const fetchStockDetails = async (stockSymbol) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();
}

export const fetchQuote = async (stockSymbol) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `${basePath}/quote?symbol=${stockSymbol}&token=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();
}

export const fetchHistoricalData = async (
  stockSymbol,
  resolution,
  from,
  to
) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = `${basePath}/stock/candle?symbol=${stockSymbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();

}