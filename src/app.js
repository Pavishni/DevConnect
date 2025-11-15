const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello Hello Hello!");
});

app.use("/test", (req, res) => {
  res.send("Hello test");
});

app.use("/", (req, res) => {
  res.send("Hello world");
});

app.listen(7777, () => {
  console.log("Server running successfully in port http://localhost:7777/....");
});
