import { useEffect } from "react";
import classes from "./HealthBar.module.css";

const HealthBar = (props) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (props.winner === undefined) {
        props.takeHealth(1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [props.winner]);
  return (
    <div
      className={classes.health_bar}
      style={{ width: `${(270 * props.hp) / 100}px` }}
    />
  );
};

export default HealthBar;
