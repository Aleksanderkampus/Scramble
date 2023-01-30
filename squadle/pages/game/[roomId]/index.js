import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Logo from "../../../public/logo.svg";
import Image from "next/image";
import io from "Socket.IO-client";
import Game from "../../../components/Game";
import Row from "../../../components/Wordle/Row/Row";
import MyKeyboard from "../../../components/Wordle/Keyboard/MyKeyboard";
import LobbyCode from "../../../components/UI/LobbyCode/LobbyCode";
import GameOver from "../../../components/UI/GameOver/GameOver";
let socket;

const GamePage = () => {
  const [input, setInput] = useState("");
  const [players, setPlayers] = useState([]);
  const [allReady, setAllPlayerReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const router = useRouter();
  const lobbyKeyboard = useRef();
  const [roomCode, setRoomCode] = useState();
  const [hp, setHp] = useState(100);
  const [currentWord, setCurrentWord] = useState("");
  const [winner, setWinner] = useState();
  const [allWords, setAllWords] = useState();

  const takeHealth = (amount) => {
    setHp((prevHp) => {
      const newHealth = prevHp - amount;
      if (newHealth <= 0) {
        socket.emit("player-dead", socket.id, roomCode);
      }
      return newHealth;
    });
  };

  const giveHealth = (amount) => {
    setHp((prevHp) => {
      const newAmount = prevHp + amount;
      return newAmount > 100 ? 100 : newAmount;
    });
  };

  const gotWordCorrect = () => {
    socket.emit("right-word", socket.id, roomCode);
  };

  const gotWordWrong = () => {
    socket.emit("new-word", socket.id, roomCode);
  };

  const handleError = (err, res) => {
    if (err) {
      router.push({
        pathname: "/",
        query: { error: err.name },
      });
    }
  };

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();
    const { roomId } = router.query;
    setRoomCode(roomId);

    socket.on("connect", () => {
      socket.emit("connect-room", { room: roomId }, handleError);
    });

    socket.on("update-players", async (allPlayers, newWord, isAllReady) => {
      if (!currentWord) {
        setCurrentWord(newWord);
      }
      setAllPlayerReady(isAllReady);
      setPlayers(allPlayers);
    });

    socket.on("take-damage", (amount) => {
      setHp((currentHp) => {
        return currentHp - amount;
      });
      if (hp - amount <= 0) {
        socket.emit("game-over", roomId, socket.id);
      }
    });

    socket.on("update-word", (newWord) => {
      setCurrentWord(newWord);
    });

    socket.on("game-over", (winner, words) => {
      setAllWords(words);
      setWinner(winner);
    });
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  const lobbyKeyPress = (button) => {
    if (!playerReady) {
      if (button === "{enter}" && input === "ready") {
        handleEnter();
        setPlayerReady(true);
      }
      if (button === "{backspace}") {
        if (input.length > 0) {
          removeTileColor();
        }
        setInput((lastInput) => {
          const newInput = lastInput.substring(0, lastInput.length - 1);
          return newInput;
        });
      } else if (input.length < 5) {
        setInput((prevInput) => {
          let newWord = prevInput + button;
          return newWord;
        });
        colorTile(button);
      }
    }
  };

  const handleEnter = () => {
    socket.emit("player-ready", socket.id, roomCode);
  };

  const removeTileColor = () => {
    const currentRow = document.getElementById("current-row");
    const tile = currentRow.children[input.length - 1];
    if (tile.classList.contains("greenTile")) {
      tile.classList.remove("greenTile");
    } else if (tile.classList.contains("yellowTile")) {
      tile.classList.remove("yellowTile");
    } else {
      tile.classList.remove("grayTile");
    }
  };

  const colorTile = (pressedKey) => {
    const currentRow = document.getElementById("current-row");
    const tile = currentRow.children[input.length];
    let tileColor = "grayTile";
    if ("ready".charAt(input.length) === pressedKey) {
      tileColor = "greenTile";
    } else if ("ready".includes(pressedKey)) {
      tileColor = "yellowTile";
    }
    tile.classList.add(tileColor);
  };

  return (
    <div className="main_page game">
      <Image className="logo" priority={true} src={Logo} alt="Squadle"></Image>
      {!allReady && <LobbyCode>{roomCode}</LobbyCode>}
      <div className="players">
        {allReady && (
          <Game
            currentWord={currentWord}
            gotCorrectWord={gotWordCorrect}
            gotWordWrong={gotWordWrong}
            hp={hp}
            takeHealth={takeHealth}
            giveHealth={giveHealth}
            winner={winner}
          ></Game>
        )}
        {winner && (
          <GameOver
            winner={"Player " + winner.playerIndex}
            words={allWords.join(" ").toUpperCase()}
          ></GameOver>
        )}
        {players.map((p, i) => {
          return (
            <>
              {!allReady && (
                <div key={i} className="card">
                  <h2 key={i}>Player {i + 1}</h2>
                  {p.user !== socket.id && (
                    <>
                      <Row
                        input={p.isReady ? "ready" : ""}
                        classes={p.isReady ? "player-ready" : ""}
                        rowNum={0}
                        rowIndex={0}
                      ></Row>
                    </>
                  )}
                  {p.user === socket.id && (
                    <>
                      <Row
                        rowNum={0}
                        rowIndex={0}
                        input={input}
                        id="current-row"
                      ></Row>
                      {!p.isReady && (
                        <>
                          <h2>Type "READY" to start</h2>
                          <MyKeyboard
                            onKeyPress={lobbyKeyPress}
                            keyboard={lobbyKeyboard}
                            baseClass={"lobbyKeyboard"}
                          ></MyKeyboard>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default GamePage;
