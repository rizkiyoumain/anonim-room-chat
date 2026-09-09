const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

const HOST = "127.0.0.1";
const PORT = 3000;

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const UPLOAD_DIR = path.join(ROOT, "uploads");
const DATA_DIR = path.join(ROOT, "data");
const MESSAGE_FILE = path.join(DATA_DIR, "messages.json");

for (const dir of [PUBLIC_DIR, UPLOAD_DIR, DATA_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

if (!fs.existsSync(MESSAGE_FILE)) {
  fs.writeFileSync(MESSAGE_FILE, "[]", "utf8");
}

app.use(express.json({ limit: "1mb" }));

app.use(express.static(PUBLIC_DIR));
app.use("/uploads", express.static(UPLOAD_DIR));

const allowedTypes = new Map([
  ["image/jpeg", "image"],
  ["image/png", "image"],
  ["image/gif", "gif"],
  ["image/webp", "image"],
  ["video/mp4", "video"],
  ["video/webm", "video"],
  ["video/quicktime", "video"]
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOAD_DIR);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename =
      Date.now() +
      "-" +
      crypto.randomBytes(8).toString("hex") +
      extension;

    callback(null, filename);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 25 * 1024 * 1024
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      return callback(
        new Error(
          "Format file tidak didukung. Gunakan JPG, PNG, GIF, WEBP, MP4, WEBM, atau MOV."
        )
      );
    }

    callback(null, true);
  }
});

function readMessages() {
  try {
    return JSON.parse(
      fs.readFileSync(MESSAGE_FILE, "utf8")
    );
  } catch {
    return [];
  }
}

function writeMessages(messages) {
  fs.writeFileSync(
    MESSAGE_FILE,
    JSON.stringify(messages, null, 2),
    "utf8"
  );
}

function cleanText(value, maxLength = 2000) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength);
}

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "Devil Room",
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| GET MESSAGES
|--------------------------------------------------------------------------
*/

app.get("/api/messages", (_req, res) => {
  const messages = readMessages();

  res.json({
    messages: messages.slice(-200)
  });
});

/*
|--------------------------------------------------------------------------
| SEND TEXT MESSAGE
|--------------------------------------------------------------------------
*/

app.post("/api/messages", (req, res) => {
  const username = cleanText(req.body.username, 40);
  const text = cleanText(req.body.message, 2000);

  if (!username) {
    return res.status(400).json({
      error: "Username diperlukan."
    });
  }

  if (!text) {
    return res.status(400).json({
      error: "Pesan tidak boleh kosong."
    });
  }

  const message = {
    id: crypto.randomUUID(),
    type: "text",
    username,
    text,
    createdAt: new Date().toISOString()
  };

  const messages = readMessages();

  messages.push(message);

  writeMessages(messages);

  res.status(201).json({
    message
  });
});

/*
|--------------------------------------------------------------------------
| UPLOAD MEDIA
|--------------------------------------------------------------------------
*/

app.post(
  "/api/upload",
  upload.single("file"),
  (req, res) => {
    const username = cleanText(
      req.body.username,
      40
    );

    if (!username) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        error: "Username diperlukan."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "File belum dipilih."
      });
    }

    const type = allowedTypes.get(
      req.file.mimetype
    );

    const message = {
      id: crypto.randomUUID(),

      type,

      username,

      originalName:
        req.file.originalname.slice(0, 200),

      mime: req.file.mimetype,

      size: req.file.size,

      url:
        "/uploads/" +
        encodeURIComponent(req.file.filename),

      createdAt:
        new Date().toISOString()
    };

    const messages = readMessages();

    messages.push(message);

    writeMessages(messages);

    res.status(201).json({
      message
    });
  }
);

/*
|--------------------------------------------------------------------------
| ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use((error, _req, res, _next) => {
  console.error(error);

  if (
    error instanceof multer.MulterError &&
    error.code === "LIMIT_FILE_SIZE"
  ) {
    return res.status(413).json({
      error: "Ukuran file maksimal 25 MB."
    });
  }

  res.status(400).json({
    error:
      error.message ||
      "Terjadi kesalahan pada server."
  });
});

/*
|--------------------------------------------------------------------------
| FRONTEND FALLBACK
|--------------------------------------------------------------------------
*/

app.get("*splat", (_req, res) => {
  res.sendFile(
    path.join(PUBLIC_DIR, "index.html")
  );
});

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

app.listen(PORT, HOST, () => {
  console.log("");
  console.log("================================");
  console.log("       DEVIL ROOM 😈");
  console.log("================================");
  console.log(
    `Server: http://${HOST}:${PORT}`
  );
  console.log("Status: ONLINE");
  console.log("================================");
  console.log("");
});