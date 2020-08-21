const express = require("express");
require("./db/mongoose");
const artisanRouter = require("./routers/artisan");
const adminRouter = require("./routers/admin");
var bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(artisanRouter);
app.use(adminRouter);

module.exports = app;
