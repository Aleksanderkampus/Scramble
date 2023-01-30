import React, { useState } from "react";
import classes from "./LobbyCode.module.css";

function LobbyCode(props) {
  const [isHovered, setIsHovered] = useState(false);
  const [text, setText] = useState("Lobby code");

  const handleDivClick = () => {
    const roomCode = document.getElementById("room-code").innerText;
    navigator.clipboard.writeText(roomCode);
    setText("Copied!");
    setTimeout(() => {
      setText("Lobby Code");
    }, 2000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setText("Click to copy!");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setText("Lobby code");
  };

  return (
    <div className={classes.container}>
      <div
        className={classes.hover_div}
        onClick={handleDivClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
        <div className={classes.room_code} id="room-code">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default LobbyCode;
