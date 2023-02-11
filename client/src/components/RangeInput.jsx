import React, { useState,useEffect } from "react";

const RangeInput = ({ name = "range",value,disabled, ...rest }) => {
  const [range, setRange] = useState(0);
  const [max, setMax] = useState(0);
  const change = ({ target: input }) => {
    let percentage = +input.value;
    setRange((prev) => percentage);
  };
  useEffect(() => {
    setRange((prev) => value);
  },[value])
  useEffect(() => {
    setMax((prev) => name === "volume" ? 1 : 2);
  },[])
  return (
    <div className="range-container" disabled={disabled}>
      <div
        className="pseudo-slider"
        style={{
          width: `${(100 * range )/ max}%`,
        }}
      >
        {(100 * range )/ max > 5 && <span>{Math.round((100 * range )/ max)}%</span>}
      </div>
      <input
        {...rest}
        min={0}
        max={max}
        step={0.1}
        type="range"
        onInput={(e) => {
          change(e);
        }}
        name={name}
        id={name}
        className="range"
      />
    </div>
  );
};

export default RangeInput;
