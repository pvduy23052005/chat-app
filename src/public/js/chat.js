import { FileUploadWithPreview } from "https://unpkg.com/file-upload-with-preview/dist/index.js";

const upload = new FileUploadWithPreview("upload-images", {
  multiple: true,
  maxFileCount: 10,
  text: {
    chooseFile: "Chọn ảnh...",
    browse: "Chọn ảnh",
    selectedCount: "ảnh đã chọn",
  },
});

// Convert file to base64

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// client send message
const formChat = document.querySelector("#chat-form");
if (formChat) {
  formChat.addEventListener("submit", async (e) => {
    e.preventDefault();
    const files = upload.cachedFileArray;
    const message = e.target[0].value;
    const images = await Promise.all(files.map((file) => fileToBase64(file)));
    if (message !== "" || images) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        message: message,
        images: images,
      });
      e.target[0].value = "";
      upload.resetPreviewPanel();
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

  let htmlContent;
  let htmlFullName = "";
  let htmlImages = "";

  if (myId == data.user_id) {
    divMessage.classList.add("inner-outgoing");
  } else {
    divMessage.classList.add("inner-incoming");
    htmlFullName = `<div class = "name"> ${data.fullName}</div>`;
  }

  if (data.message !== "") {
    htmlContent = `<div class = "content"> ${data.content}</div>`;
  }

  if (data.images.length > 0) {
    htmlImages += `<div class = "images">`;
    data.images.forEach((imageUrl) => {
      htmlImages += `<img src=${imageUrl} alt="">`;
    });
    htmlImages += "</div>";
  }

  if (htmlContent) {
    divMessage.innerHTML = `
    ${htmlFullName}
    ${htmlImages}
  `;
  } else {
    divMessage.innerHTML = `
    ${htmlFullName}
    ${htmlContent} 
    ${htmlImages}
  `;
  }

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

const btnIcon = document.querySelector(".chat-main #chat-form .btn-icon");
if (btnIcon) {
  btnIcon.addEventListener("click", () => {
    const boxIcon = document.querySelector("emoji-picker");
    boxIcon.classList.toggle("show");
  });
}
// send icon .
const boxIcon = document.querySelector("emoji-picker");

if (boxIcon) {
  boxIcon.addEventListener("emoji-click", (e) => {
    const chatInput = document.querySelector(
      ".chat-main .chat-box #chat-form input"
    );
    const icon = e.detail.unicode;
    chatInput.value += icon;
  });
}
// end send icon .
