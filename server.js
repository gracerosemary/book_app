/* eslint-disable indent */
"use strict";

// bring in our dependencies

const express = require("express");
const superagent = require("superagent");
const cors = require("cors");

// configure env file to allow variables to be listened to
require("dotenv").config();

// create port - process.env object - process is a dotenv method
const PORT = process.env.PORT || 3000;

// start express application
const app = express();

// CORS
app.use(cors());

// where the server will look for pages to serve the browser
app.use(express.static("./public"));

// decode our POST data
app.use(express.urlencoded({ extended: true }));

// set default view engine and what we're using to view (ejs)
app.set("view engine", "ejs");

// test route
app.get("/hello", (request, response) => {
  const greeting = "hellllllo";
  response.render("index", { greeting: greeting });
});

// search route
app.get("/searches/new", (request, response) => {
  console.log("hello");
  response.render("pages/searches/new");
});

app.post("/searches", bookSearch);
function bookSearch(request, response) {
  let search = request.body.search[0];
  let searchCategory = request.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;
  if (searchCategory === "title") {
    url += `intitle:${search}`;
  }
  if (searchCategory === "author") {
    url += `inauthor:${search}`;
  }

  superagent
    .get(url)
    // map over the array of results - create new Book instance from results
    .then((results) => {
      let returned = results.body.items;
      let arr = returned.map((bookResults) => {
        return new Book(bookResults.volumeInfo);
      });
      // console.log(request.body.search[0]);
      // render array of objects in searches/show
      response.render("pages/searches/show", { searchResults: arr, });
    });
}

// constructor function
// properties needed: image, title name, author name, book description (under volumeInfo)
function Book(obj) {
  this.image = obj.imageLinks.thumbnail
    ? obj.imageLinks.thumbnail
    : `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = obj.title ? obj.title : "Title not available";
  this.author = obj.authors ? obj.authors : "Author(s) not available";
  this.description = obj.description
    ? obj.description
    : "Description not available";
}

// error handler

// start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));
