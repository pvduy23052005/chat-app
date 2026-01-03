import { Server, Socket } from "socket.io";
import http from "http";
import authSokcet from "./middlewares/authSocket.middwares";
import userSocket from "./handlers/user.socket";
import chatSocket from "./handlers/chat.socket";
import User from "../models/user.model";

const socketConfig = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // config global. 
  (global as any)._io = io;

  // auth middleware.
  io.use(authSokcet);

  io.on("connection", (socket: Socket) => {
    chatSocket(io, socket);
    userSocket(io, socket);

    socket.on("disconnect", async () => {
    });
  });

  return io;
};

export default socketConfig;
