require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("./db/conn")
const router = require("./Routes/router");

app.use(express.json());
app.use(cors());
app.use(router); 
app.use("/uploads", express.static("./uploads"))


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})