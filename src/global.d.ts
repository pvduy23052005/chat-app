import { Server } from "socket.io";

declare global {
  // Khai báo biến _io tồn tại ở phạm vi toàn cục
  var _io: Server;
}

export { };