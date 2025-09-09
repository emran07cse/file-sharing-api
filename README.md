# 📂 File Sharing API (Node.js)

A simple **file sharing REST API server** built with **Node.js + Express**, supporting local storage and extendable to cloud providers (Google Cloud, AWS, etc.).  
It includes:  
- File upload/download/delete endpoints  
- Daily upload/download limits per IP  
- Automatic cleanup of inactive files  
- Unit & integration tests  

---

## 🚀 Features
- **Upload files** (`POST /files`)  
- **Download files** (`GET /files/:publicKey`)  
- **Delete files** (`DELETE /files/:privateKey`)  
- **Configurable daily rate limits** per IP for uploads & downloads  
- **Cleanup job** to remove inactive files after `N` days  
- **Modular storage provider** (local by default, cloud-ready)  
- **Full test coverage** (unit + integration with Jest + Supertest)  

---

## 📦 Requirements
- [Node.js LTS](https://nodejs.org/en/download/) 
- npm  

---

## ⚙️ Installation

```bash
git clone https://github.com/emran07cse/file-sharing-api.git
cd file-sharing-api
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```ini
# Server
PORT=4000
FOLDER=./uploads

# Limits
UPLOAD_LIMIT=10        # max uploads per IP per day
DOWNLOAD_LIMIT=20      # max downloads per IP per day

# Cleanup
CLEANUP_DAYS=7         # delete files not accessed for N days

# Storage provider (future extension)
PROVIDER=local
CONFIG=./config/google.json
```

---

## ▶️ Running the Server

```bash
npm start
```

Server will start at:  
👉 `http://localhost:4000`

---

## 📡 API Endpoints

### 1️ Upload a file
**POST** `/files`  
- Form-data:  
  - `file` (type: File)  

✅ Response:
```json
{
  "publicKey": "1234-5678-...",
  "privateKey": "abcd-efgh-..."
}
```

---

### 2️ Download a file
**GET** `/files/:publicKey`  
- Returns file stream  

Example:
```
GET http://localhost:4000/files/1234-5678
```

---

### 3️ Delete a file
**DELETE** `/files/:privateKey`  

✅ Response:
```json
{
  "message": "File deleted successfully"
}
```

---

## ⏳ Rate Limiting

- Daily upload & download limits per IP  
- Configurable via `.env`:  
  - `UPLOAD_LIMIT`  
  - `DOWNLOAD_LIMIT`  
- Returns `429 Too Many Requests` if limit exceeded.  

---

## 🧹 Cleanup Job

- Runs every 24h  
- Deletes files not accessed for `CLEANUP_DAYS` days  
- Configurable via `.env`  

---

## 🧪 Testing

Run all tests:

```bash
npm test
```

By default, if no tests exist, Jest will exit with code `1`.  
You can allow exit without tests using:

```bash
npm test -- --passWithNoTests
```

---

### Unit Tests
- Located in `src/__tests__/localStorage.test.js`  
- Tests file save/retrieve/delete logic  

### Integration Tests
- Located in `src/__tests__/files.test.js`  
- Covers full flow:  
  - Upload → Download → Delete  

---

## 🗂 Project Structure
```
meldcx/
│ .env
│ package.json
│ server.js
│ README.md
├─ src/
│  ├─ routes/
│  │   └─ files.js
│  ├─ storage/
│  │   └─ localStorage.js
│  ├─ middleware/
│  │   └─ rateLimit.js
│  └─ jobs/
│      └─ cleanup.js
└─ __tests__/
   ├─ files.test.js
   └─ localStorage.test.js
```

--- 
