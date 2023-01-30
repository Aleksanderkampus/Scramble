import classes from "./GameOver.module.css";
import { useState, useEffect } from "react";
import Button from "../Button/Button";
import { useRouter } from "next/router";

const GameOver = (props) => {
  const [xPos, setXPos] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setXPos((xPos) => (xPos - 1 + 300) % 300);
    }, 10);
    return () => clearInterval(intervalId);
  }, []);

  const backToFront = () => {
    window.location.replace("/");
  };

  return (
    <>
      <div className={classes.overlay}>
        <div className={classes.game_over}>
          <h2>Game over</h2>
          <h2>Winner: {props.winner}</h2>
          <div
            style={{ width: `${300}px`, overflow: "hidden", height: "40px" }}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: xPos,
                  whiteSpace: "nowrap",
                }}
              >
                {props.words ?? "Moving words"}
              </div>
              <div style={{ position: "absolute", left: xPos - 300 }}>
                {props.words ?? "Moving words"}
              </div>
            </div>
          </div>
          <div>
            <Button onClick={backToFront}>Back to menu</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameOver;
