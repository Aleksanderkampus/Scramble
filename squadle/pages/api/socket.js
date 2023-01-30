import { Server } from "socket.io";
import { POPULAR_WORDS } from "../../public/popular-five-letter-words";

export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  const rooms = {};
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const getNewWord = (playerId, roomId) => {
    const room = rooms[roomId];
    const player = room.players.find((p) => p.user === playerId);
    const wordNumber = player.wordNum;
    let newWord;
    if (wordNumber === room.words.length) {
      newWord = POPULAR_WORDS[Math.floor(Math.random() * POPULAR_WORDS.length)];
      room.words.push(newWord);
    } else {
      newWord = room.words[wordNumber];
    }
    player.wordNum++;
    return newWord;
  };

  const onePlayerStanding = (roomPlayers) => {
    const playersAlive = [];
    for (const player of roomPlayers) {
      if (!player.isDead) {
        playersAlive.push(player);
      }
    }
    return playersAlive;
  };

  const checkAllPlayersReady = (players) => {
    for (const player of players) {
      if (!player.isReady || players.length < 2) {
        return false;
      }
    }
    return true;
  };

  const playerDead = (playerId, roomId) => {
    const room = rooms[roomId];
    const player = room.players.find((p) => p.user === playerId);
    player.isDead = true;
    const playersAlive = onePlayerStanding(room.players);
    if (playersAlive.length === 1) {
      io.in(roomId).emit("game-over", playersAlive[0], room.words);
    }
  };

  // Define actions inside
  io.on("connection", (socket) => {
    socket.on("disconnect", (reason) => {
      for (const key in rooms) {
        var room = rooms[key];
        const player = room.players.find((p) => p.user === socket.id);
        if (player) {
          if (!room.gameStarted) {
            room.players = room.players.filter((p) => p.user !== player.user);
            io.in(key).emit("update-players", room.players);
          } else {
            if (room.players.length > 1) {
              playerDead(player.user, key);
            }
            room.players = room.players.filter((p) => p.user !== player.user);
          }
        }
        if (room.players.length == 0) {
          delete rooms[key];
          break;
        }
      }
    });

    socket.on("new-word", (player, roomId) => {
      const newWord = getNewWord(player, roomId);
      io.in(player).emit("update-word", newWord);
    });

    socket.on("player-dead", (playerId, roomId) => {
      playerDead(playerId, roomId);
    });

    socket.on("right-word", (player, roomId) => {
      socket.to(roomId).emit("take-damage", 20);
      const newWord = getNewWord(player, roomId);
      io.in(player).emit("update-word", newWord);
    });

    socket.on("player-ready", (playerId, roomId) => {
      var room = rooms[roomId];
      const player = room.players.find((p) => p.user === playerId);
      player.isReady = true;
      const allReady = checkAllPlayersReady(room.players);
      if (allReady) {
        room.gameStarted = true;
      }
      io.in(roomId).emit(
        "update-players",
        room.players,
        room.words[0],
        allReady
      );
    });

    socket.on("connect-room", (data, res) => {
      let clientsInRoom = 0;
      if (io.sockets.adapter.rooms.get(data.room)) {
        clientsInRoom = io.sockets.adapter.rooms.get(data.room).size;
      }
      if (clientsInRoom >= 2) {
        var err = new Error("Room already has 2 clients");
        err.name = "Room already has 2 clients";
        res(err);
      } else {
        socket.join(data.room);
        res(null, "Joined room: " + data.room);
        if (!rooms[data.room]) {
          rooms[data.room] = {};
          rooms[data.room].words = [];
          rooms[data.room].gameStarted = false;
          rooms[data.room].players = [
            {
              user: socket.id,
              isReady: false,
              isDead: false,
              wordNum: 0,
              playerIndex: 1,
            },
          ];
          const newWord = getNewWord(socket.id, data.room);
          rooms[data.room].words = [newWord];
        } else {
          rooms[data.room].players.push({
            user: socket.id,
            isReady: false,
            isDead: false,
            wordNum: 1,
            playerIndex: rooms[data.room].players.length + 1,
          });
        }
        io.in(data.room).emit(
          "update-players",
          rooms[data.room].players,
          rooms[data.room].words[0]
        );
      }
    });
  });

  console.log("Setting up socket");
  res.end();
}
