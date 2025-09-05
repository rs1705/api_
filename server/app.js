//imports
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

//routes
const FeedRoutes = require("./routes/feed");
const AuthRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // respond to preflight immediately
  }
  next();
});

app.use("/feed", FeedRoutes);
app.use("/auth", AuthRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500; // default
  const message = error.message || "Something went wrong!";
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});
const MONGODB_URI =
  "mongodb+srv://pathfinder:yfnTB9Pi5zft3m1p@cluster0.ezbowy4.mongodb.net/blog_api?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(
    app.listen(8080, () => {
      console.log("server running.");
    })
  )
  .catch((err) => {
    console.log(err);
  });
