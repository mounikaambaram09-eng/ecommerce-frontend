import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <h2
      style={{
        textAlign: "center",
        color: "red",
        marginTop: "40px",
      }}
    >
      Error: {message}
    </h2>
  );
};

export default ErrorMessage;