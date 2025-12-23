import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as database from "./config/database";
import indexRoute from "./routes/index.route";
import { Server, Socket } from "socket.io";
import http from "http"


const port: number | string | undefined = process.env.PORT;
const app: Express = express();

// congif socket.io
const server = http.createServer(app);
const io = new Server(server, {
  // Cấu hình CORS để tránh lỗi nếu client/server khác domain (dev mode)
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket: Socket) => {
  console.log(socket.id);
})

// config pug . 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "public")));

// config global . 
(global as any)._io = io;

database.connectDatabase();

indexRoute(app);

server.listen(port, () => {
  console.log(`Server listening: ${port}`);
})