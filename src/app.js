const express = require("express");
const connectDb = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authrouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");

app.use("/",authrouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDb()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(7777, () => {
      console.log(
        "Server running successfully in port http://localhost:7777/...."
      );
    });
  })
  .catch((err) => {
    console.error("Database not connected");
  });
