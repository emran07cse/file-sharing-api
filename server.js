require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fileRoutes = require("./src/routes/files");

require("./src/jobs/cleanup");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/files", fileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`File Sharing API running on port ${PORT}`);
});
