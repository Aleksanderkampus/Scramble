import Home from "../components/Home";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ErrorMessage from "../components/UI/ErrorMessage/ErrorMessage";

export default function Main() {
  const [room, setRoom] = useState("");
  const router = useRouter();
  const { error } = router.query;

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
    <>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Home
        joinRoom={joinRoom}
        roomInputHandler={roomInputHandler}
        createRandomRoom={createRandomRoom}
        buttonDisabled={room.length < 6}
      ></Home>
    </>
  );
}
