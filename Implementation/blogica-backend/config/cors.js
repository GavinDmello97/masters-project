const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = [
  "http://localhost:3000",
  "https://localhost:3443",
  "https://localhost:3001",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://blogica.netlify.app",
  "http://blogica.netlify.app",
  "https://blogica.netlify.app/",
  "http://blogica.netlify.app",
];

var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1 || !req.header("Origin")) {
    corsOptions = {
      origin: true,
    };
  } else {
    corsOptions = {
      origin: false,
    };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
