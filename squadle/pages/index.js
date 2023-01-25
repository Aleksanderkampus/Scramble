import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useState, useRef } from "react";
import { WORDS } from "../public/five-letter-words";
import { POPULAR_WORDS } from "../public/popular-five-letter-words";

//WORDS[Math.floor(Math.random() * WORDS.length)]

export default function Home() {
  const [input, setInput] = useState("");
  const [enteredWords, setEnteredWords] = useState([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(
    POPULAR_WORDS[Math.floor(Math.random() * POPULAR_WORDS.length)]
  );
  const keyboard = useRef();
  const [greenButtons, setGreenButtons] = useState([]);
  const [yellowButtons, setYellowButtons] = useState([]);
  const [grayButtons, setGrayButtons] = useState([]);

  const handleEnter = () => {
    if (WORDS.includes(input)) {
      setLetterColors();
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
      console.log(currentWord);
      const currentRow = document.getElementById("current-row");
      currentRow.classList.add("shake");
      setTimeout(() => currentRow.classList.remove("shake"), 300);
    }
  };

  const setLetterColors = () => {
    const yellowLetters = [];
    const grayLetters = [];
    const greenLetters = [];
    const currentRow = document.getElementById("current-row");
    for (let index = 0; index < input.length; index++) {
      const tile = currentRow.children[index];
      let letterColor = "grayTile";
      const inputChar = input.charAt(index);
      const currentWordChar = currentWord.charAt(index);
      const noGreenLetter =
        !greenLetters.includes(inputChar) && !greenButtons.includes(inputChar);
      const noYellowLetter =
        !yellowButtons.includes(inputChar) &&
        !yellowLetters.includes(inputChar);

      if (inputChar === currentWordChar) {
        if (yellowButtons.includes(inputChar)) {
          setYellowButtons((latest) => {
            latest.splice(latest.indexOf(inputChar), 1);
            return latest;
          });
        }
        if (noGreenLetter) {
          greenLetters.push(inputChar);
        }
        letterColor = "greenTile";
      } else if (currentWord.includes(inputChar) && noYellowLetter) {
        if (noGreenLetter) {
          yellowLetters.push(inputChar);
        }

        letterColor = "yellowTile";
      } else if (noGreenLetter && noYellowLetter) {
        grayLetters.push(inputChar);
      }

      const delay = 100 * index;
      setTimeout(() => {
        //shade box
        tile.classList.add(letterColor);
      }, delay);
    }
    setKeyboardColors(greenLetters, yellowLetters, grayLetters);
  };

  const setKeyboardColors = (greenLetters, yellowLetters, grayLetters) => {
    setGreenButtons((latest) => {
      const newArr = [...latest, ...greenLetters];
      return newArr;
    });
    setYellowButtons((latest) => {
      const newArr = [...latest, ...yellowLetters];
      return newArr;
    });
    setGrayButtons((latest) => {
      const newArr = [...latest, ...grayLetters];
      return newArr;
    });
  };

  const onKeyPress = (button) => {
    if (button === "{enter}" && input.length === 5) {
      handleEnter();
    } else if (button === "{backspace}") {
      setInput((lastInput) => {
        const newInput = lastInput.substring(0, lastInput.length - 1);
        return newInput;
      });
    } else if (input.length < 5) {
      setInput((prevInput) => {
        let newWord = prevInput + button;
        return newWord;
      });
    }
  };

  return (
    <div className="card">
      <div>
        {[0, 1, 2, 3, 4, 5].map((row) => {
          return (
            <div
              key={row}
              id={rowIndex === row ? "current-row" : ""}
              className="row"
            >
              {[0, 1, 2, 3, 4].map((column) => {
                return (
                  <div key={row + "_" + column} className="tile">
                    {rowIndex === row
                      ? input.length - 1 >= column
                        ? input.charAt(column).toLocaleUpperCase()
                        : ""
                      : enteredWords.length - 1 >= row
                      ? enteredWords[row].charAt(column).toLocaleUpperCase()
                      : ""}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="keyboard">
        <Keyboard
          keyboardRef={(r) => (keyboard.current = r)}
          layoutName="default"
          onKeyPress={onKeyPress}
          physicalKeyboardHighlight={true}
          physicalKeyboardHighlightPress={true}
          display={{
            "{backspace}": "<",
            "{enter}": "ENTR",
          }}
          layout={{
            default: [
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "{enter} z x c v b n m {backspace}",
            ],
          }}
          buttonTheme={[
            {
              class: "greenButtons",
              buttons: greenButtons.length !== 0 ? greenButtons.join(" ") : " ",
            },
            {
              class: "yellowButtons",
              buttons:
                yellowButtons.length !== 0 ? yellowButtons.join(" ") : " ",
            },
            {
              class: "grayButtons",
              buttons: grayButtons.length !== 0 ? grayButtons.join(" ") : " ",
            },
          ]}
        />
      </div>
    </div>
  );
}
