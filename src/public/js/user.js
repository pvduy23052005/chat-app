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
});
socket.on("SERVER_SEND_ROOM_ID_WAITING", (data) => {
  const roomId = data.roomId;
  window.location.href = `/chat/not-friend?roomId=${roomId}`;
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
      button.closest(".box-user").classList.add("accepted");
      socket.emit("CLIENT_ACCEPT_FRIEND", {
        userId: userId,
      });
    });
  });
}
// end btn acceptd

// statusOnline
socket.on("SERVER_USER_ONLINE", (data) => {
  const listUser = document.querySelector(".chat-main .chat-list-friend");
  const user = listUser.querySelector(`[user-id="${data.userId}"]`);
  if (user) {
    const statusOnline = user.querySelector(".inner-status");
    statusOnline.setAttribute("status", data.status);
  }
});
// end statusOnline

// serach user
const search = document.querySelector("#form-search");
if (search) {
  let url = new URL(window.location.href);
  search.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = e.target[0].value;
    if (searchValue) {
      url.searchParams.set("keyword", searchValue);
    } else {
      url.searchParams.delete("keyword");
    }
    e.target[0].value = e.target[0].value.trim();
    window.location.href = url.href;
  });
}
// end serach user

// user leave room chat
socket.on("SERVER_USER_LEAVE_ROOM", (data) => {
  const body = document.querySelector(".chat-message-body");
  if (body) {
    const div = document.createElement("div");
    div.classList.add("system-message");

    div.innerHTML = `
      <span>${data.fullName} đã rời nhóm</span>
    `;

    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  const boxRoom = document.querySelector(
    `.box-friend[room-id="${data.room_id}"]`
  );

  if (boxRoom) {
    const lastMessage = boxRoom.querySelector(".last-message");
    if (lastMessage) {
      lastMessage.innerHTML = `<i class="text-muted small">${data.fullName} đã rời nhóm</i>`;
    }
  }
});
// end user leave room chat
