import React from "react";

const FormResponse = ({ message, onOkClick }) => {
  return (
    <div className="form-response">
      <p>{message}</p>
      <button onClick={onOkClick}>Ok</button>
    </div>
  );
};

export default FormResponse;
