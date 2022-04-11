const express = require("express");
const bodyParser = require("body-parser");
const headers = new express.Router();

headers.use(bodyParser.json());
headers.use(bodyParser.urlencoded({ extended: false }));

headers.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization,Content-Range,range"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH,PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Expose-Headers", "Content-Range,range");
  next();
});

module.exports = headers;
