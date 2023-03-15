let express = require("express");
let app = express();
var path = require("path");
var bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));

const homePath = __dirname + "/views/index.html";
const staticPath = __dirname + "/public";

// serve static assets from the /public directory
app.use("/public", express.static(__dirname + "/public"));

// log the details of each request
app.use(function (req, res, next) {
	console.log(`${req.method} ${req.path} - ${req.ip}`);
	next();
});

// serve the index.html file on the root path
app.get("/", function (req, res) {
	res.sendFile(homePath);
});

// read the environment variable to determine whether the message should be transformed
app.get("/json", function (req, res) {
	const value = { message: "Hello json" };
	const isUpperCase = process.env.MESSAGE_STYLE === "uppercase";
	const transformedMessage = isUpperCase
		? value.message.toUpperCase()
		: value.message;

	res.json({ message: transformedMessage });
});

// return the current time on the /now route
app.get(
	"/now",
	function (req, res, next) {
		req.time = new Date().toString();
		next();
	},
	function (req, res) {
		res.json({ time: req.time });
	}
);

// 'echo' the word passed in as a route parameter to the request
app.get("/:word/echo", function (req, res) {
	res.json({ echo: req.params.word });
});

// output the names passed in as query parameters to the request
// e.g. http://localhost:3000/name?firstname=tony&lastname=abbott
// app.get("/name", function (req, res) {
// 	const firstName = req.query.firstname || "";
// 	const lastName = req.query.lastname || "";

// 	res.json({ name: `${firstName} ${lastName}` });
// });

// read values from request body and return as json
app.post("/name", function (req, res) {
	const firstName = req.body.first || "";
	const lastName = req.body.last || "";
	res.json({ name: `${firstName} ${lastName}` });
});

module.exports = app;
