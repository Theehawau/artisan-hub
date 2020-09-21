const express = require("express");
const path = require("path");
require("./db/mongoose");
const hbs = require("hbs");
const artisanRouter = require("./routers/artisan");
const adminRouter = require("./routers/admin");
var bodyParser = require("body-parser");

const app = express();
//Define paths for express config
const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebars engine and views,partials location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDir));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", artisanRouter);
app.use("/admin", adminRouter);

module.exports = app;
