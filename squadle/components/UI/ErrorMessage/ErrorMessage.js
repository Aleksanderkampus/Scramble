import React, { useState, useEffect } from "react";
import classes from "./ErrorMessage.module.css";

const ErrorMessage = (props) => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }, 500);
  }, []);

  return (
    <div
      className={
        classes.error_container + (showError ? " " + classes.show : "")
      }
    >
      <div className={classes.error}>Error: {props.children}</div>
    </div>
  );
};

export default ErrorMessage;
