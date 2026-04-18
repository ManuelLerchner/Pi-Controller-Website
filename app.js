const express = require("express");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");

dotenv.config({ path: "./config/config.env" });

require("./ServerFunctions/Logger.js");
const HandleIO = require("./ServerFunctions/HandleIO.js");
require("./database/db");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");
app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));

app.use("/", require("./routes/controller"));
app.use("/api", require("./routes/api"));

app.get("/*", function (req, res) {
    res.redirect("/");
});

const server = http.createServer(app);
const io = new Server(server);

const ioHandler = new HandleIO(io);
ioHandler.handleEvents();

const PORT = process.env.NODE_ENV === "developement"
    ? (process.env.HTTP_DEV_PORT || 3001)
    : (process.env.HTTP_PORT || 3001);

server.listen(PORT, () =>
    console.log(`Pi-Controller running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
