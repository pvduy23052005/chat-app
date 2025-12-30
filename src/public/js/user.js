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

// cancel add friend .
const btnCancelFriend = document.querySelectorAll(".btn-cancel");
if (btnCancelFriend) {
  btnCancelFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      const userId = button.getAttribute("user-id");
      button.closest(".box-user").classList.remove("add-friend-request");
      socket.emit("CLIENT_FRIEND_CANCEL", {
        userId: userId,
      });
    });
  });
}
// end cancel add friend .

// refuse friend
const btnRefuseFriend = document.querySelectorAll(".btn-refuse-friend");
if (btnRefuseFriend) {
  btnRefuseFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const userId = button.getAttribute("user-id");
      button.closest(".box-user").classList.add("refuse");
      socket.emit("CLIENT_REFUSE_FRIEND", {
        userId: userId,
      });
    });
  });
}
// end refuse friend

// btn acceptd
const btnAcceptFriend = document.querySelectorAll(".btn-accept-friend");
if (btnAcceptFriend) {
  btnAcceptFriend.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const userId = button.getAttribute("user-id");
      button.closest(".box-user").classList.add(".accepted");
      socket.emit("CLIENT_ACCEPT_FRIEND", {
        userId: userId,
      });
    });
  });
}

// end btn acceptd
