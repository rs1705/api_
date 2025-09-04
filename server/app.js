const express = require("express");
const bodyParser = require("body-parser");
const FeedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-control-allow-origin", "*");
  res.setHeader(
    "Access-control-allow-methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-control-allow-headers", "Content-type, Authorization");
  next();
});
app.use("/feed", FeedRoutes);

app.listen(8080, () => {
  console.log("server running.");
});
