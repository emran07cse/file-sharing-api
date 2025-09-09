let StorageProvider;

if (process.env.PROVIDER === "google") {
    StorageProvider = require("../storage/googleStorage");
} else {
    StorageProvider = require("../storage/localStorage");
}

module.exports = StorageProvider;
