import classes from "./Tile.module.css";

const Tile = (props) => {
  return <div className={classes.tile}>{props.children}</div>;
};

export default Tile;
