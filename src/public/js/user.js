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
  window.location.href = `/chat?roomId=${roomId}`;
  console.log(roomId);
});
// end chat not-friend .

// friend request ..
const btnAddFriend = document.querySelectorAll(".btn-add");
if (btnAddFriend) {
  btnAddFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const userId = button.getAttribute("user-id");
      button.closest(".box-user").classList.add("add-friend-request");
      socket.emit("CIENT_FRIEND_REQUEST", {
        userId: userId,
      });
    });
  });
}
// end add-friend .
