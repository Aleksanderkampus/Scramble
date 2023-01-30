import Logo from "../public/logo.svg";
import Image from "next/image";
import Button from "../components/UI/Button/Button";
import classes from "./Home.module.css";
import Input from "./UI/Input/Input";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home(props) {
  return (
    <div className={classes.main_page}>
      <Image
        priority={true}
        className={classes.logo}
        src={Logo}
        alt="Squadle"
      ></Image>
      <div className={classes.menu}>
        <Button onClick={props.createRandomRoom}>Create game</Button>
        <div className={classes.join_room}>
          <Input
            input={{
              placeholder: "Join Room",
              onChange: props.roomInputHandler,
            }}
          />
          <Button disabled={props.buttonDisabled} onClick={props.joinRoom}>
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
