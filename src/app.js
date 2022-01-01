require("dotenv").config(); // Load .env key-value to process.env
const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

const { usersRouter } = require("./routes/users.routes");
const { authRouter } = require("./routes/auth.routes");

app = express();

// Built-in middlewares
app.use(cors());
app.use(express.json()); // converts the POST body to JSON object and attach to req.body

app.use("/", usersRouter);
app.use("/", authRouter);

// Catch unauthorised errors - error thrown from express-jwt (requireSignin middleware)
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

app.listen(process.env.MERN_BACKEND_PORT || 3002, () => {
  console.log(
    `Application runnign at ${process.env.MERN_BACKEND_PORT || 3002}...!!`
  );
});

// Establish a connection to MongoDB using Mongoose (Object Document Mapper - ODM)
mongoose
  .connect(process.env.MERN_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB...!!"))
  .catch((err) => console.log(err));
