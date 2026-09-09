# 😈 Devil Room - Anonymous Chat

Aplikasi chat anonim real-time tanpa perlu login atau membuat akun. Berbasis Node.js + Express dengan support media (gambar & video).

---

## 📋 Fitur

- ✅ Chat anonymous real-time
- ✅ Upload gambar & video (max 25MB)
- ✅ Sticker picker
- ✅ GIF support
- ✅ Dark mode UI
- ✅ Mobile responsive
- ✅ Drag & drop file
- ✅ Username auto-generate

---

## 🏗️ Struktur Folder

```
anonim-room-chat/
├── public/
│   ├── index.html        # Frontend HTML
│   ├── app.js            # Frontend JavaScript
│   └── style.css         # Styling
├── uploads/              # Folder media (auto-created)
├── data/
│   └── messages.json     # Database messages
├── server.js             # Backend server
├── package.json          # Dependencies
└── README.md             # Dokumentasi
```

---

## 🚀 Quick Start

### ✅ Prerequisites

Pastikan sudah install:
- **Node.js LTS** (`node --version`)
- **npm** (`npm --version`)
- **Git** (opsional)

---

## 📱 Instalasi & Setup di Termux

### **Step 1: Update Termux**

```bash
pkg update
pkg upgrade
```

### **Step 2: Install Node.js**

```bash
pkg install nodejs-lts
```

Verifikasi:
```bash
node --version
npm --version
```

### **Step 3: Clone Repository**

```bash
cd ~
git clone https://github.com/rizkiyoumain/anonim-room-chat.git
cd anonim-room-chat
```

Atau download manual dan extract.

### **Step 4: Setup Folder Structure**

```bash
# Buat folder public jika belum ada
mkdir -p public

# Copy file ke public folder (jika masih di root)
cp index.html public/
cp style.css public/
cp app.js public/

# Verifikasi
ls -la public/
```

### **Step 5: Install Dependencies**

```bash
npm install
```

Output expected:
```
added 70 packages in 3s
```

### **Step 6: Jalankan Server**

```bash
npm start
```

Expected output:
```
================================
       DEVIL ROOM 😈
================================
Server: http://127.0.0.1:3000
Status: ONLINE
================================
```

---

## 🌐 Akses Aplikasi

### **Local (Sama Device)**
```
http://localhost:3000
```

### **Dari Device Lain (Termux Server)**

1. **Cari IP Termux:**
```bash
ifconfig
# atau
hostname -I
```

2. **Akses dari device lain:**
```
http://<IP_TERMUX>:3000
# Contoh: http://192.168.1.100:3000
```

---

## ⚙️ Konfigurasi

Edit `server.js` jika ingin mengubah:

```javascript
const HOST = "127.0.0.1";  // 0.0.0.0 untuk akses external
const PORT = 3000;          // Port server
```

**Ubah ke:**
```javascript
const HOST = "0.0.0.0";     // Bisa akses dari device lain
const PORT = 3000;
```

Restart server setelah perubahan.

---

## 📁 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/messages` | Ambil 200 pesan terakhir |
| POST | `/api/messages` | Kirim text message |
| POST | `/api/upload` | Upload media (img/video) |

### Contoh Request:

**Send Text:**
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"username":"Devil","message":"Halo!"}'
```

**Upload File:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@photo.jpg" \
  -F "username=Devil"
```

---

## 🛠️ Troubleshooting

### **Error: ENOENT: no such file or directory, stat 'public/index.html'**

**Solusi:**
```bash
mkdir -p public
cp index.html public/
cp style.css public/
cp app.js public/
```

### **Port 3000 sudah digunakan**

**Opsi 1 - Ganti port:**
```javascript
const PORT = 3001;  // Di server.js
```

**Opsi 2 - Cari proses yang menggunakan port 3000:**
```bash
lsof -i :3000
kill -9 <PID>
```

### **Cannot find module 'express' atau 'multer'**

**Solusi:**
```bash
npm install
```

### **Connection refused**

Pastikan:
- Server sudah running (`npm start`)
- URL benar (`http://localhost:3000`)
- Tidak ada firewall yang memblokir

---

## 🔄 Keep Server Running (Background)

### Termux Tetap Berjalan di Background:

```bash
# Option 1: Gunakan nohup
nohup npm start > server.log 2>&1 &

# Option 2: Gunakan screen
apt install screen
screen -S devilroom
npm start
# Tekan Ctrl+A lalu D untuk detach
```

### Stop Server:

```bash
pkill -f "node server.js"
# atau
kill <PID>
```

---

## 📊 Data & Database

Messages disimpan di `data/messages.json` (plain JSON file).

**Format pesan:**
```json
{
  "id": "uuid",
  "type": "text|sticker|image|gif|video",
  "username": "SilentWolf123",
  "text": "Hello!",
  "createdAt": "2024-12-09T10:30:00.000Z"
}
```

---

## 🔐 Security Notes

- Aplikasi ini untuk **development/testing** saja
- Semua chat bersifat **public** & tidak terenkripsi
- File uploads disimpan di folder `uploads/`
- Max file size: **25MB**

---

## 📝 Lisensi

MIT - Bebas digunakan untuk personal & komersial

---

## 👨‍💻 Developer

Created with 😈 by **rizkiyoumain**

---

## 📞 Support

Jika ada error atau pertanyaan:
1. Baca section **Troubleshooting** di atas
2. Buka Issue di GitHub
3. Check logs: `cat server.log`

---

**Happy chatting! 🔥**
