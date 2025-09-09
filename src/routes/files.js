const express = require("express");
const multer = require("multer");
const mime = require("mime-types");
const fs = require("fs");
// const LocalStorage = require("../storage/localStorage");
const LocalStorage = require("../storage");
const rateLimit = require("../middlewares/rateLimit");

const router = express.Router();
const upload = multer({ dest: "temp/" }); // temp folder for uploads

// POST /files → upload
router.post("/", rateLimit("upload"), upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const result = await LocalStorage.saveFile(req.file);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "File upload failed" });
    }
});

// GET /files/:publicKey → download
router.get("/:publicKey", rateLimit("download"),async (req, res) => {
    try {
        const filePath = await LocalStorage.getFile(req.params.publicKey);
        if (!filePath) return res.status(404).json({ error: "File not found" });

        res.setHeader("Content-Type", mime.lookup(filePath) || "application/octet-stream");
        fs.createReadStream(filePath).pipe(res);
    } catch (err) {
        res.status(500).json({ error: "File retrieval failed" });
    }
});

// DELETE /files/:privateKey → delete
router.delete("/:privateKey", async (req, res) => {
    try {
        const deleted = await LocalStorage.deleteFile(req.params.privateKey);
        if (!deleted) return res.status(404).json({ error: "File not found or invalid key" });

        res.json({ message: "File deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "File deletion failed" });
    }
});

module.exports = router;
