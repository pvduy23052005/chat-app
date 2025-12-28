// chat not-friend .
const listBtnChat = document.querySelectorAll(".btn-chat");
if (listBtnChat) {
  listBtnChat.forEach((btnChat) => {
    btnChat.addEventListener("click", () => {
      const userId = btnChat.getAttribute("user-id");
      socket.emit("CLIENT_SEND_CHAT", userId);
    });
  });
}

// client on SERVER_SEND_ROOM_ID
socket.on("SERVER_SEND_ROOM_ID", (data) => {
  const roomId = data.roomId;
  window.location.href = `/chat/${roomId}`;
  console.log(roomId);
});
// end chat not-friend .
