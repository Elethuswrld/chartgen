"use client";
import { useEffect, useState } from "react";

const Ticker = () => {
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>{ticker}</div>;
};

export default Ticker;
