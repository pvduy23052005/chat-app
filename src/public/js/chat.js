// client send message
const formChat = document.querySelector("#chat-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = e.target[0].value;
    if (message !== "") {
      socket.emit("CLIENT_SEND_MESSAGE", {
        message: message,
      });
      e.target[0].value = "";
    }
  });
}
// end client send message

// client on send message
socket.on("SERVER_SEND_MESSAGE", (data) => {
  const chatBox = document.querySelector(".chat-body .chat-message-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const divMessage = document.createElement("div");

  let htmlContent = "";
  let htmlFullName = "";

  console.log(data);

  if (myId == data.user_id) {
    divMessage.classList.add("inner-outgoing");
  } else {
    divMessage.classList.add("inner-incoming");
    htmlFullName = `<div class = "name"> ${data.fullName}</div>`;
  }

  if (data.message !== "") {
    htmlContent = `<div class = "content"> ${data.content}</div>`;
  }

  divMessage.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
  `;

  console.log(divMessage.innerHTML);

  chatBox.appendChild(divMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
});
// end client on send message
