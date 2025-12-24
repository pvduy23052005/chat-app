// client send message
const formChat = document.querySelector("#chat-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = e.target[0].value;
    socket.emit("CLIENT_SEND_MESSAGE", {
      message: message,
    });
    e.target[0].value = "";
  });
}
// end client send message
