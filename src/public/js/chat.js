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
  const listTyping = document.querySelector(
    ".chat-main .chat-body .inner-list-typing"
  );

  let htmlContent = "";
  let htmlFullName = "";

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

  chatBox.insertBefore(divMessage, listTyping);
  chatBox.scrollTop = chatBox.scrollHeight;
});
// end client on send message

// typing.
// CLIENT SEND TYPING .
const input = document.querySelector(
  ".chat-main .chat-body #chat-form input[type='text']"
);
if (input) {
  input.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
  });
}

// CLIENT ON TYPING .

const listTyping = document.querySelector(
  ".chat-main .chat-body .inner-list-typing"
);
if (listTyping) {
  socket.on("SERVER_SEND_TYPING", (data) => {
    const existsUser = listTyping.querySelector(`[user-id='${data.user_id}']`);
    const chatBox = document.querySelector(".chat-body .chat-message-body");

    if (!existsUser) {
      const boxTyping = document.createElement("div");
      boxTyping.setAttribute("user-id", data.user_id);
      boxTyping.classList.add("box-typing");
      const htmlName = `<div class = "inner-name">${data.fullName}</div>`;
      const htmlDots = `
        <div class = "inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

      boxTyping.innerHTML = `
        ${htmlName}
        ${htmlDots}
      `;

      listTyping.appendChild(boxTyping);
      setTimeout(() => {
        listTyping.removeChild(boxTyping);
      }, 3000);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
}

// end typing .
