"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Database connected.");
    mongoose.connection.on("error", (e) => {
      console.log("Error in database connection: " + e);
    });
    //For FCC testing purposes
    fccTestingRoutes(app);

    //Routing for API
    apiRoutes(app);

    //Index page (static HTML)
    app.route("/").get(function (req, res) {
      res.sendFile(process.cwd() + "/views/index.html");
    });

    //404 Not Found Middleware
    app.use(function (req, res, next) {
      res.status(404).type("text").send("Not Found");
    });

    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          console.log("Tests are not valid:");
          console.error(e);
        }
      }, 1500);
    }
  })
  .catch((e) => {
    console.log("Db connection failed: " + e);
  });

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

module.exports = app; //for unit/functional testing
