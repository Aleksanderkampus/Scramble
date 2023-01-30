import { useState, useRef, useEffect } from "react";
import { WORDS } from "../public/five-letter-words";
import { POPULAR_WORDS } from "../public/popular-five-letter-words";
import Row from "./Wordle/Row/Row";
import MyKeyboard from "./Wordle/Keyboard/MyKeyboard";
import HealthBar from "./Wordle/HealthBar/HealthBar";

//WORDS[Math.floor(Math.random() * WORDS.length)]
//POPULAR_WORDS[Math.floor(Math.random() * POPULAR_WORDS.length)]

export default function Game(props) {
  const [input, setInput] = useState("");
  const [enteredWords, setEnteredWords] = useState([]);
  const [rowIndex, setRowIndex] = useState(0);
  const gameKeyboard = useRef();
  const [greenButtons, setGreenButtons] = useState([]);
  const [yellowButtons, setYellowButtons] = useState([]);
  const [grayButtons, setGrayButtons] = useState([]);

  const resetBoard = () => {
    removeTileColors();
    setEnteredWords([]);
    setInput("");
    setGrayButtons([]);
    setGreenButtons([]);
    setYellowButtons([]);
    setRowIndex(0);
  };

  const removeTileColors = () => {
    const rows = document.getElementById("rows");
    for (let i = 0; i < rowIndex; i++) {
      console.log(rowIndex);
      const row = rows.children[i];
      for (let j = 0; j < 5; j++) {
        const tile = row.children[j];
        const classList = Array.from(tile.classList).filter(
          (c) => c !== "greenTile" && c !== "yellowTile" && c !== "grayTile"
        );
        tile.classList.remove(...tile.classList);
        tile.classList.add(classList);
      }
    }
  };

  const handleEnter = () => {
    if (WORDS.includes(input)) {
      newSetLetterColors();
      setRowIndex((i) => {
        const j = i + 1;
        return j;
      });
      setEnteredWords((latest) => {
        const newArr = [...latest, input];
        return newArr;
      });
      setInput("");
    } else {
      const currentRow = document.getElementById("current-row");
      currentRow.classList.add("shake");
      setTimeout(() => currentRow.classList.remove("shake"), 300);
    }
  };

  useEffect(() => {
    const lastWord =
      enteredWords && enteredWords.length > 0
        ? enteredWords[enteredWords.length - 1]
        : "";

    if (props.currentWord === lastWord) {
      props.giveHealth(30);
      props.gotCorrectWord();
      setTimeout(() => {
        resetBoard();
      }, 200);
    } else if (enteredWords.length === 6) {
      props.takeHealth(20);
      props.gotWordWrong();
      setTimeout(() => {
        resetBoard();
      }, 200);
    }
  }, [enteredWords]);

  const deleteFromOtherButtons = (inputChar) => {
    if (grayButtons.includes(inputChar)) {
      setGrayButtons((latest) => {
        latest.splice(latest.indexOf(inputChar), 1);
        return latest;
      });
    }
    if (yellowButtons.includes(inputChar)) {
      setYellowButtons((latest) => {
        latest.splice(latest.indexOf(inputChar), 1);
        return latest;
      });
    }
  };

  const newSetLetterColors = () => {
    const yellowLetters = [];
    const grayLetters = [];
    const greenLetters = [];
    let amountToGive = 0;
    let remainingLettersInWord = props.currentWord;
    const currentRow = document.getElementById("current-row");
    for (let i = 0; i < 5; i++) {
      const tile = currentRow.children[i];
      if (input.charAt(i) === props.currentWord.charAt(i)) {
        remainingLettersInWord = remainingLettersInWord.replace(
          props.currentWord.charAt(i),
          ""
        );
        greenLetters.push(input.charAt(i));
        deleteFromOtherButtons(input.charAt(i));
        tile.classList.add("greenTile");
        amountToGive += 2;
      } else {
        tile.classList.add("grayTile");
        grayLetters.push(input.charAt(i));
      }
    }
    for (let i = 0; i < 5; i++) {
      const tile = currentRow.children[i];
      if (
        remainingLettersInWord.includes(input.charAt(i)) &&
        input.charAt(i) !== props.currentWord.charAt(i)
      ) {
        remainingLettersInWord = remainingLettersInWord.replace(
          input.charAt(i),
          ""
        );
        tile.classList.remove("grayTile");
        if (grayButtons.includes(input.charAt(i))) {
          setGrayButtons((latest) => {
            latest.splice(latest.indexOf(input.charAt(i)), 1);
            return latest;
          });
        }
        tile.classList.add("yellowTile");
        yellowLetters.push(input.charAt(i));
        amountToGive += 1;
      }
    }
    setKeyboardColors(greenLetters, yellowLetters, grayLetters);
    props.giveHealth(amountToGive);
  };

  const filterLetterArrays = (greenLetters, yellowLetters, grayLetters) => {
    const newGrayLetters = [];
    const newYellowLetters = [];
    grayLetters.forEach((element) => {
      if (
        !yellowLetters.includes(element) &&
        !yellowButtons.includes(element) &&
        !greenButtons.includes(element) &&
        !greenLetters.includes(element)
      ) {
        newGrayLetters.push(element);
      }
    });
    yellowLetters.forEach((element) => {
      if (!greenLetters.includes(element) && !greenButtons.includes(element)) {
        newYellowLetters.push(element);
      }
    });
    return [greenLetters, newYellowLetters, newGrayLetters];
  };

  const setKeyboardColors = (greenLetters, yellowLetters, grayLetters) => {
    const [newGreenLetters, newYellowLetters, newGrayLetters] =
      filterLetterArrays(greenLetters, yellowLetters, grayLetters);
    setGreenButtons((latest) => {
      newGreenLetters.forEach((element) => {
        if (!latest.includes(element)) {
          latest.push(element);
        }
      });
      return latest;
    });
    setYellowButtons((latest) => {
      newYellowLetters.forEach((element) => {
        if (!latest.includes(element)) {
          latest.push(element);
        }
      });
      return latest;
    });
    setGrayButtons((latest) => {
      newGrayLetters.forEach((element) => {
        if (!latest.includes(element)) {
          latest.push(element);
        }
      });
      return latest;
    });
  };

  const GameKeyPress = (button) => {
    if (props.winner === undefined) {
      if (button === "{enter}" && input.length === 5) {
        handleEnter();
      } else if (button === "{backspace}") {
        setInput((lastInput) => {
          const newInput = lastInput.substring(0, lastInput.length - 1);
          return newInput;
        });
      } else if (input.length < 5 && button !== "{enter}") {
        setInput((prevInput) => {
          let newWord = prevInput + button;
          return newWord;
        });
      }
    }
  };

  return (
    <div className="card">
      <h2>Player - {props.hp} HP</h2>
      <div className="health-bar">
        <HealthBar
          hp={props.hp}
          winner={props.winner}
          takeHealth={props.takeHealth}
        ></HealthBar>
      </div>
      <div id="rows">
        {[0, 1, 2, 3, 4, 5].map((row) => {
          return (
            <Row
              key={row}
              rowNum={row}
              id={rowIndex === row ? "current-row" : ""}
              input={input}
              rowIndex={rowIndex}
              enteredWords={enteredWords}
            ></Row>
          );
        })}
      </div>
      <MyKeyboard
        onKeyPress={GameKeyPress}
        keyboard={gameKeyboard}
        baseClass={"gameKeyboard"}
        buttonTheme={[
          {
            class: "greenButtons",
            buttons: greenButtons.length !== 0 ? greenButtons.join(" ") : " ",
          },
          {
            class: "yellowButtons",
            buttons: yellowButtons.length !== 0 ? yellowButtons.join(" ") : " ",
          },
          {
            class: "grayButtons",
            buttons: grayButtons.length !== 0 ? grayButtons.join(" ") : " ",
          },
        ]}
      ></MyKeyboard>
    </div>
  );
}
