import Logo from "../public/logo.svg";
import Image from "next/image";
import Button from "../components/UI/Button/Button";
import classes from "./Home.module.css";
import Input from "./UI/Input/Input";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [room, setRoom] = useState("");
  const router = useRouter();

  const createRandomRoom = () => {
    const roomId = randomString(6);
    router.push("/game/" + roomId);
  };

  const roomInputHandler = (e) => {
    setRoom(e.target.value);
  };

  function randomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const joinRoom = () => {
    router.push("/game/" + room);
  };

  return (
    <div className={classes.main_page}>
      <Image className={classes.logo} src={Logo} alt="Squadle"></Image>
      <div className={classes.menu}>
        <Button onClick={createRandomRoom}>Create game</Button>
        <div className={classes.join_room}>
          <Input
            input={{ placeholder: "Join Room", onChange: roomInputHandler }}
          />
          <Button disabled={room.length < 6} onClick={joinRoom}>
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
