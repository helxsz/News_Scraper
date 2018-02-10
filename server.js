const express = require("express");
// Initialize Express
const app = express();
const bodyParser = require("body-parser");
const logger = require("morgan");
// ORM for mongodb
const mongoose = require("mongoose");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// set up handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

// Sets up the Express middleware to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

const localDB = 'mongodb://localhost/MediumScraper'
const MONGODB_URI = process.env.MONGODB_URI || localDB;

mongoose.connect(MONGODB_URI);
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;

// Routes
// =============================================================
require("./routes/html-routes")(app);
require("./routes/mongodb-routes")(app);
require("./routes/scrape-routes")(app);

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
