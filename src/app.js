const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send("Hello world");
});

app.post("/user", (req, res)=>{
  res.send("Data successfully inserted");
});

app.delete("/user",(req,res)=>{
  res.send("Data successfully deleted");
});

app.listen(7777, () => {
  console.log("Server running successfully in port http://localhost:7777/....");
});
