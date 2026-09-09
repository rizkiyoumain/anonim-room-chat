const $ = (selector) =>
  document.querySelector(selector);


/*
|--------------------------------------------------------------------------
| ELEMENTS
|--------------------------------------------------------------------------
*/

const chat = $("#chat");

const messagesEl =
  $("#messages");

const input =
  $("#messageInput");

const sendBtn =
  $("#sendBtn");

const composer =
  $("#composer");

const fileInput =
  $("#fileInput");

const attachBtn =
  $("#attachBtn");

const gifBtn =
  $("#gifBtn");

const stickerBtn =
  $("#stickerBtn");

const stickerPicker =
  $("#stickerPicker");

const attachmentPreview =
  $("#attachmentPreview");

const previewContent =
  $("#previewContent");

const removeAttachment =
  $("#removeAttachment");

const toast =
  $("#toast");

const usernameLabel =
  $("#usernameLabel");


/*
|--------------------------------------------------------------------------
| ANONYMOUS USERNAME
|--------------------------------------------------------------------------
*/

const adjectives = [
  "Silent",
  "Crimson",
  "Shadow",
  "Neon",
  "Rogue",
  "Dark",
  "Midnight",
  "Ghost",
  "Inferno",
  "Vicious",
  "Hidden",
  "Wicked",
  "Toxic",
  "Bloody",
  "Mystic"
];

const nouns = [
  "Wolf",
  "Raven",
  "Demon",
  "Phantom",
  "Fox",
  "Crow",
  "Specter",
  "Snake",
  "Reaper",
  "Bat",
  "Void",
  "Hunter",
  "Skull",
  "Devil",
  "Shadow"
];

let username =
  localStorage.getItem(
    "devilRoomUsername"
  );

let selectedFile = null;

let knownIds = new Set();


if (!username) {

  const adjective =
    adjectives[
      Math.floor(
        Math.random() *
        adjectives.length
      )
    ];

  const noun =
    nouns[
      Math.floor(
        Math.random() *
        nouns.length
      )
    ];

  username =
    adjective +
    noun +
    Math.floor(
      100 + Math.random() * 900
    );

  localStorage.setItem(
    "devilRoomUsername",
    username
  );
}

usernameLabel.textContent =
  username;


/*
|--------------------------------------------------------------------------
| TOAST
|--------------------------------------------------------------------------
*/

function showToast(message) {

  toast.textContent =
    message;

  toast.classList.add("show");

  clearTimeout(
    showToast.timer
  );

  showToast.timer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2200);
}


/*
|--------------------------------------------------------------------------
| TIME
|--------------------------------------------------------------------------
*/

function formatTime(date) {

  return new Date(date)
    .toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
}


/*
|--------------------------------------------------------------------------
| ADD MESSAGE TO UI
|--------------------------------------------------------------------------
*/

function addMessage(message) {

  if (
    message.id &&
    knownIds.has(message.id)
  ) {
    return;
  }

  if (message.id) {
    knownIds.add(
      message.id
    );
  }

  const row =
    document.createElement("div");

  row.className =
    "message " +
    (
      message.username === username ||
      message.mine
        ? "mine"
        : ""
    );


  const avatar =
    document.createElement("div");

  avatar.className =
    "avatar";

  avatar.textContent =
    "😈";


  const bubble =
    document.createElement("div");

  bubble.className =
    "bubble";


  const meta =
    document.createElement("div");

  meta.className =
    "meta";

  meta.textContent =
    `${message.username || username} • ${formatTime(
      message.createdAt || Date.now()
    )}`;

  bubble.appendChild(
    meta
  );


  /*
  |--------------------------------------------------------------------------
  | TEXT
  |--------------------------------------------------------------------------
  */

  if (
    message.type === "text"
  ) {

    const text =
      document.createElement("div");

    text.className =
      "text";

    text.textContent =
      message.text || "";

    bubble.appendChild(
      text
    );
  }


  /*
  |--------------------------------------------------------------------------
  | STICKER
  |--------------------------------------------------------------------------
  */

  else if (
    message.type === "sticker"
  ) {

    const sticker =
      document.createElement("div");

    sticker.className =
      "sticker";

    sticker.textContent =
      message.text || "😈";

    bubble.appendChild(
      sticker
    );
  }


  /*
  |--------------------------------------------------------------------------
  | IMAGE / GIF
  |--------------------------------------------------------------------------
  */

  else if (
    message.type === "image" ||
    message.type === "gif"
  ) {

    const image =
      document.createElement("img");

    image.className =
      "media";

    image.src =
      message.url;

    image.alt =
      message.originalName ||
      "image";

    image.loading =
      "lazy";

    bubble.appendChild(
      image
    );
  }


  /*
  |--------------------------------------------------------------------------
  | VIDEO
  |--------------------------------------------------------------------------
  */

  else if (
    message.type === "video"
  ) {

    const video =
      document.createElement("video");

    video.className =
      "media";

    video.src =
      message.url;

    video.controls =
      true;

    video.playsInline =
      true;

    bubble.appendChild(
      video
    );
  }


  row.append(
    avatar,
    bubble
  );

  messagesEl.appendChild(
    row
  );

  scrollToBottom();
}


/*
|--------------------------------------------------------------------------
| SCROLL
|--------------------------------------------------------------------------
*/

function scrollToBottom() {

  chat.scrollTop =
    chat.scrollHeight;
}


/*
|--------------------------------------------------------------------------
| LOAD MESSAGES
|--------------------------------------------------------------------------
*/

async function loadMessages() {

  try {

    const response =
      await fetch(
        "/api/messages",
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        "Gagal memuat pesan."
      );
    }

    const data =
      await response.json();

    for (
      const message
      of data.messages || []
    ) {

      addMessage(
        message
      );
    }

  } catch (error) {

    console.error(
      error
    );

    showToast(
      "Server belum terhubung."
    );
  }
}


/*
|--------------------------------------------------------------------------
| SEND TEXT
|--------------------------------------------------------------------------
*/

async function sendText() {

  const text =
    input.value.trim();

  if (!text) {
    return;
  }

  sendBtn.disabled =
    true;

  try {

    const response =
      await fetch(
        "/api/messages",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              username,
              message: text
            })
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.error ||
        "Gagal mengirim pesan."
      );
    }

    addMessage(
      data.message
    );

    input.value = "";

    resizeInput();

  } catch (error) {

    console.error(
      error
    );

    showToast(
      error.message
    );

  } finally {

    sendBtn.disabled =
      false;

    input.focus();
  }
}


/*
|--------------------------------------------------------------------------
| SEND FILE
|--------------------------------------------------------------------------
*/

async function sendFile() {

  if (!selectedFile) {
    return;
  }

  sendBtn.disabled =
    true;

  showToast(
    "Mengunggah..."
  );

  try {

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
    );

    formData.append(
      "username",
      username
    );


    const response =
      await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.error ||
        "Upload gagal."
      );
    }


    addMessage(
      data.message
    );


    clearFile();

    showToast(
      "Upload berhasil."
    );

  } catch (error) {

    console.error(
      error
    );

    showToast(
      error.message
    );

  } finally {

    sendBtn.disabled =
      false;
  }
}


/*
|--------------------------------------------------------------------------
| SELECT FILE
|--------------------------------------------------------------------------
*/

function selectFile(file) {

  if (!file) {
    return;
  }

  const allowed = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime"
  ];


  if (
    !allowed.includes(
      file.type
    )
  ) {

    showToast(
      "Format file tidak didukung."
    );

    return;
  }


  if (
    file.size >
    25 * 1024 * 1024
  ) {

    showToast(
      "Maksimal file 25 MB."
    );

    return;
  }


  selectedFile =
    file;

  previewContent.innerHTML =
    "";


  /*
  |--------------------------------------------------------------------------
  | IMAGE PREVIEW
  |--------------------------------------------------------------------------
  */

  if (
    file.type.startsWith(
      "image/"
    )
  ) {

    const image =
      document.createElement(
        "img"
      );

    image.src =
      URL.createObjectURL(
        file
      );

    previewContent.appendChild(
      image
    );

  }


  /*
  |--------------------------------------------------------------------------
  | VIDEO PREVIEW
  |--------------------------------------------------------------------------
  */

  else {

    const video =
      document.createElement(
        "video"
      );

    video.src =
      URL.createObjectURL(
        file
      );

    video.controls =
      true;

    video.muted =
      true;

    previewContent.appendChild(
      video
    );
  }


  const name =
    document.createElement(
      "div"
    );

  name.className =
    "preview-name";

  name.textContent =
    `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;

  previewContent.appendChild(
    name
  );


  attachmentPreview.classList.remove(
    "hidden"
  );
}


/*
|--------------------------------------------------------------------------
| CLEAR FILE
|--------------------------------------------------------------------------
*/

function clearFile() {

  selectedFile =
    null;

  fileInput.value =
    "";

  previewContent.innerHTML =
    "";

  attachmentPreview.classList.add(
    "hidden"
  );
}


/*
|--------------------------------------------------------------------------
| TEXTAREA AUTO RESIZE
|--------------------------------------------------------------------------
*/

function resizeInput() {

  input.style.height =
    "auto";

  input.style.height =
    Math.min(
      input.scrollHeight,
      120
    ) + "px";
}


/*
|--------------------------------------------------------------------------
| COMPOSER
|--------------------------------------------------------------------------
*/

composer.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    if (selectedFile) {

      await sendFile();

    } else {

      await sendText();
    }
  }
);


/*
|--------------------------------------------------------------------------
| ATTACH BUTTON
|--------------------------------------------------------------------------
*/

attachBtn.addEventListener(
  "click",
  () => {

    fileInput.click();

  }
);


fileInput.addEventListener(
  "change",
  () => {

    selectFile(
      fileInput.files[0]
    );

  }
);


/*
|--------------------------------------------------------------------------
| REMOVE FILE
|--------------------------------------------------------------------------
*/

removeAttachment.addEventListener(
  "click",
  clearFile
);


/*
|--------------------------------------------------------------------------
| STICKER PICKER
|--------------------------------------------------------------------------
*/

stickerBtn.addEventListener(
  "click",
  () => {

    stickerPicker.classList.toggle(
      "hidden"
    );

  }
);


/*
|--------------------------------------------------------------------------
| SEND STICKER
|--------------------------------------------------------------------------
*/

stickerPicker.addEventListener(
  "click",
  async (event) => {

    const button =
      event.target.closest(
        "button"
      );

    if (!button) {
      return;
    }

    const sticker =
      button.textContent;


    try {

      const response =
        await fetch(
          "/api/messages",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({
                username,
                message: sticker
              })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Gagal mengirim sticker."
        );
      }


      data.message.type =
        "sticker";


      addMessage(
        data.message
      );


      stickerPicker.classList.add(
        "hidden"
      );

    } catch (error) {

      showToast(
        error.message
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| GIF
|--------------------------------------------------------------------------
*/

gifBtn.addEventListener(
  "click",
  () => {

    showToast(
      "Upload GIF lewat tombol ＋ untuk sekarang."
    );

  }
);


/*
|--------------------------------------------------------------------------
| TEXT INPUT
|--------------------------------------------------------------------------
*/

input.addEventListener(
  "input",
  resizeInput
);


input.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      composer.requestSubmit();
    }
  }
);


/*
|--------------------------------------------------------------------------
| CLOSE STICKER PICKER
|--------------------------------------------------------------------------
*/

document.addEventListener(
  "click",
  (event) => {

    if (
      !stickerPicker.contains(
        event.target
      ) &&
      event.target !== stickerBtn
    ) {

      stickerPicker.classList.add(
        "hidden"
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| DRAG & DROP
|--------------------------------------------------------------------------
*/

document.addEventListener(
  "dragover",
  (event) => {

    event.preventDefault();

  }
);


document.addEventListener(
  "drop",
  (event) => {

    event.preventDefault();

    const file =
      event.dataTransfer
        ?.files?.[0];

    if (file) {
      selectFile(file);
    }

  }
);


/*
|--------------------------------------------------------------------------
| INITIALIZE
|--------------------------------------------------------------------------
*/

loadMessages();

setInterval(
  loadMessages,
  2500
);