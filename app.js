const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const Routers = require("./routes");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//! Config App
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
app.use(cors());
app.use(multerMid.single("file"));
// app.use(express.json());
// app.use(express.bodyParser({ limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requestd-With, Content-Type, Accept, Authorization"
    ),
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE"),
    (res.io = io);
  next();
});

app.get("/", (req, res) => {
  res.send("JaiD api");
});

//! Route API
app.use("/api", Routers);

io.on("connection", function (socket) {
  socket.on("disconnect", function () {});
});

module.exports = http;
// app.listen(config.port, () => console.log(`server run listening on port ${config.port}`));
