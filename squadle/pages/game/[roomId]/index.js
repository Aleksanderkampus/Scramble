import { useRouter } from "next/router";

const Game = () => {
  const router = useRouter();
  const { roomId } = router.query;
  return <div>{roomId}</div>;
};

export default Game;
