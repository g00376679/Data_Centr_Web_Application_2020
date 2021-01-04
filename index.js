const express = require("express");
var bodyParser = require("body-parser");
const getMySqlConnection = require("./mysql");
const getMongoConnection = require("./mongodb");
const routes = require("./routes");

const app = express();
// set engine ejs
app.set("view engine", "ejs");
app.set("mysql", getMySqlConnection);
app.set("mongodb", getMongoConnection);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use("/", routes);

app.listen(3007, () => {
  console.log("Listening on port 3007");
});
