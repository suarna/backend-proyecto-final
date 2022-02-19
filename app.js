require("./lib/connection");

// TODO: Configurar multer para subida de imagenes/videos
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { errorHandler } = require("./middlewares");

const {
  articulosRouter,
  usuariosRouter,
  loginRouter,
  registerRouter,
} = require("./routes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/articles", articulosRouter);
app.use("/users", usuariosRouter);
app.use(errorHandler);

module.exports = app;
