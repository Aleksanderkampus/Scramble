import Tile from "../Tile/Tile";
import classes from "./Row.module.css";

const Row = (props) => {
  return (
    <div id={props.id} className={classes.row + " " + props.classes}>
      {[0, 1, 2, 3, 4].map((column) => {
        return (
          <Tile key={props.rowNum + "_" + column}>
            {props.rowIndex === props.rowNum
              ? props.input.length - 1 >= column
                ? props.input.charAt(column).toLocaleUpperCase()
                : ""
              : props.enteredWords &&
                props.enteredWords.length - 1 >= props.rowNum
              ? props.enteredWords[props.rowNum]
                  .charAt(column)
                  .toLocaleUpperCase()
              : ""}
          </Tile>
        );
      })}
    </div>
  );
};

export default Row;
