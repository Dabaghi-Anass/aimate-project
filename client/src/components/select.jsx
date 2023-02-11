import React from "react";

const Select = ({ label,name, options, ...rest }) => (
  <div className="select-container" >
    <label htmlFor={`id-${name}`} className="form-label settings-labels">
      {label}
    </label>
    <div
      style={{
        position: "relative",
      }}
    >
      <label htmlFor={`id-${name}`} className="select_activation_btn"></label>
      <select {...rest} name={name} id={`id-${name}`}>

        {options.map((e) => (
          <option key={`key-${Math.random() * 0xffffff}-${e.value || e.name}`} value={e.value ||e.name}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default Select;
