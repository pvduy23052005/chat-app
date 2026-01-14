import { FileUploadWithPreview } from "https://unpkg.com/file-upload-with-preview/dist/index.js";

const uploadImages = document.querySelector("[data-upload-id]");
let upload;
if (uploadImages) {
  upload = new FileUploadWithPreview("upload-images", {
    multiple: true,
    maxFileCount: 10,
    text: {
      chooseFile: "Chọn ảnh...",
      browse: "Chọn ảnh",
      selectedCount: "ảnh đã chọn",
    },
  });
}

// client send message
const formChat = document.querySelector("#chat-form");
if (formChat) {
  formChat.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputContent = e.target.querySelector("input");
    const message = e.target[0].value.trim();
    // file [images , .pdf , .doc]
    const files = upload.cachedFileArray || [];
    const filePayloads = await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              buffer: reader.result, // ArrayBuffer
              fileName: file.name,
              mimeType: file.type,
            });
          };
          reader.readAsArrayBuffer(file);
        });
      })
    );
    // get roomId .
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get("roomId");

    if (message === "") {
      inputContent.focus();
      return;
    }

    if ((message !== "" || filePayloads.length > 0) && roomId) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        message: message,
        images: filePayloads,
        roomId: roomId,
        status: "sent",
      });
      e.target[0].value = "";
      upload.resetPreviewPanel();
      upload.cachedFileArray = [];
    }
  });
}
// end client send message

// client on send message
const objectViewer = {
  title: false, // Tắt tiêu đề file để giao diện sạch sẽ
  toolbar: {
    zoomIn: 1,
    zoomOut: 1,
    oneToOne: 1,
    reset: 1,
    prev: 1,
    next: 1,
    rotateLeft: 1,
    rotateRight: 1,
    flipHorizontal: 0,
    flipVertical: 0,
  },
  // Quan trọng: Để CSS backdrop-filter hoạt động tốt trên một số trình duyệt
  className: "custom-viewer-modal",
};

socket.on("SERVER_SEND_MESSAGE", (data) => {
  const currentRoomId = new URLSearchParams(window.location.search).get(
    "roomId"
  );
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const bodyChatList = document.querySelector(".chat-list-friend");
  const boxUser = bodyChatList.querySelector(
    `.box-friend[room-id="${data.room_id}"]`
  );
  if (bodyChatList) {
    if (boxUser) {
      const prefix = data.user_id === myId ? "Bạn: " : `${data.fullName}: `;
      const boxLastMessage = boxUser.querySelector(".last-message");

      if (currentRoomId !== data.room_id) {
        boxLastMessage.classList.add("unread");
      }
      const messageToShow = data.content ? data.content : "Đã gửi một ảnh";
      let fullText = `${prefix}${messageToShow}`;
      if (fullText.length > 25) {
        fullText = fullText.slice(0, 25) + "...";
      }
      boxLastMessage.innerHTML = fullText;
      bodyChatList.prepend(boxUser);
    }
  }
  if (currentRoomId != data.room_id) {
    return;
  }

  if (data.user_id === myId) {
    {
      const oldStatus = document.querySelector(
        ".chat-message-body .chat-status"
      );
      oldStatus.remove();
    }
  }

  // print message .
  const chatBox = document.querySelector(".chat-body .chat-message-body");
  const divMessage = document.createElement("div");
  const listTyping = document.querySelector(
    ".chat-main .chat-body .inner-list-typing"
  );

  let htmlContent;
  let htmlFullName = "";
  let htmlImages = "";
  let htmlAvatar = "";
  let htmlTime = "";
  let htmlStatus = "";

  const now = new Date();
  const time = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (data.user_id === myId) {
    htmlStatus = `
    <span class="chat-status" data-status="sent">
      Đã Gửi
    </span>`;
  }

  htmlTime = `<div class="inner-time">${time}</div>`;

  if (myId == data.user_id) {
    divMessage.classList.add("inner-outgoing");
  } else {
    divMessage.classList.add("inner-incoming");
    htmlFullName = `<div class = "name"> ${data.fullName}</div>`;
    htmlAvatar = `
    <div class = "avatar">
      <img src=${
        data.avatar ? data.avatar : "/images/default-avatar.webp"
      } alt="">
    </div>
    `;
  }

  if (data.content !== "") {
    htmlContent = `<div class = "content"> ${data.content}</div>`;
  }

  if (data.fileUrls.length > 0) {
    htmlImages += `<div class = "images">`;

    data.fileUrls.forEach((fileUrl) => {
      const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i);

      if (isImage) {
        htmlImages += `<img src=${fileUrl} alt="" class="chat-image-preview" >`;
      } else {
        const fileName = fileUrl
          .split("/")
          .pop()
          .split("?")[0]
          .split(":upload:")[0];
        htmlImages += `
          <a href="${fileUrl}" target="_blank" class="file-attachment-box" >
            <i class='bx  bx-file'></i> 
            <span class = "file-name" >${fileName}</span>
          </a>
        `;
      }
    });
    htmlImages += "</div>";
  }

  divMessage.innerHTML = `
        ${htmlAvatar}
      <div class = "inner-message">
        ${htmlFullName}
        ${htmlContent} 
        ${htmlImages} 
        <div class = "inner-foot">
          ${htmlTime}
          ${htmlStatus}
        </div>
      </div>
    `;

  chatBox.insertBefore(divMessage, listTyping);
  const gallery = new Viewer(divMessage, objectViewer);
  chatBox.scrollTop = chatBox.scrollHeight;

  // user dang o trong phong nay luon . hien la xem luon
  if (data.user_id != myId) {
    socket.emit("CLIENT_SENT_SEEN", {
      roomId: data.room_id,
    });
  }
});
// end client on send message

// viewer images
const bodyViewer = document.querySelectorAll(
  ".chat-main .chat-message-body .inner-message"
);
if (bodyViewer) {
  bodyViewer.forEach((viewer) => {
    const gallery = new Viewer(viewer, objectViewer);
  });
}
//end  viewer images

// typing.
// CLIENT SEND TYPING .
const input = document.querySelector(
  ".chat-main .chat-body #chat-form input[type='text']"
);
if (input) {
  input.addEventListener("keyup", () => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get("roomId");
    socket.emit("CLIENT_SEND_TYPING", {
      type: "show",
      roomId: roomId,
    });
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
    const currentRoomId = new URL(window.location.href).searchParams.get(
      "roomId"
    );

    if (data.room_id !== currentRoomId) {
      return;
    }

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

// scrollBody
const chatBox = document.querySelector(".chat-body .chat-message-body");
if (chatBox) {
  chatBox.scrollTop = chatBox.scrollHeight;
}
// end scrollBody

// status message
const listRooms = document.querySelectorAll("[room-id]");
if (listRooms) {
  listRooms.forEach((room) => {
    room.addEventListener("click", (e) => {
      const boxLastMessage = room.querySelector(".last-message");
      if (boxLastMessage) {
        boxLastMessage.classList.remove("unread");
      }
      const roomId = room.getAttribute("room-id");
      console.log(roomId);
      // emit event CLIENT_SEND_SEEN.
      socket.emit("CLIENT_SENT_SEEN", {
        roomId: roomId,
      });
    });
  });
}

socket.on("SERVER_RETURN_SEEN", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");

  if (myId !== data.userId) {
    const chatStatus = document.querySelector("[data-status]");
    if (chatStatus) {
      chatStatus.setAttribute("data-status", "seen");
      chatStatus.innerHTML = `
        <span class="chat-status" data-status="seen ">
          Đã xem
        </span>
      `;
    }
  }
});
// end status message
