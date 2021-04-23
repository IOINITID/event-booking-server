const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send("Server response.");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
