const express = require("express");
const {auth} = require("./middlewares/auth")

const app = express();

app.use("/admin", auth);

app.get("/admin/getAllData", (req, res) => {
  res.send("Data successfully fetched");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("Data deleted successfully");
});

app.listen(7777, () => {
  console.log("Server running successfully in port http://localhost:7777/....");
});