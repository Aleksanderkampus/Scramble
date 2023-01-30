import classes from "./MyKeyboard.module.css";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

const MyKeyboard = (props) => {
  return (
    <div className={classes.keyboard}>
      <Keyboard
        keyboardRef={(r) => (props.keyboard.current = r)}
        layoutName="default"
        onKeyPress={props.onKeyPress}
        physicalKeyboardHighlight={true}
        physicalKeyboardHighlightPress={true}
        baseClass={props.baseClass}
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
        buttonTheme={props.buttonTheme}
      />
    </div>
  );
};

export default MyKeyboard;
