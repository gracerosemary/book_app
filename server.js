/* eslint-disable indent */
'use strict';

// bring in our dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');

// configure env file to allow variables to be listened to
require('dotenv').config();

// create port - process.env object - process is a dotenv method
const PORT = process.env.PORT || 3000;

// start express application
const app = express();

// CORS
app.use(cors());

// where the server will look for pages to serve the browser
app.use(express.static('./public'));

// decode our POST data
app.use(express.urlencoded({ extended: true }));

// set default view engine and what we're using to view (ejs)
app.set('view engine', 'ejs');

// routes
app.get('/', home);
app.get('/searches/new', newSearch);
app.post('/searches', bookSearch);
app.get('/books/:id', singleBook);
app.post('/books', addBook);
app.get('/error', errorHandler);

// Handlers
function home(request, response) {
  const SQL = 'SELECT * FROM books;';
  
  return client.query(SQL)
  .then(results => {
    console.log(results.rows);
    response.status(200).render('pages/index', { books: results.rows });
  })
  .catch(error => {
    console.log(error);
  });
}

function singleBook(request, response) {
  // console.log(request.params.id);
  const SQL = 'SELECT * FROM books WHERE id=$1';
  const params = [request.params.id];
  console.log('testing check check');
  client.query(SQL, params)
    .then(results => {
      console.log(results.rows);
      response.render('pages/books/detail', { 'results': [results.rows[0]]});
    });
}

function addBook(request, response) {
  const SQL = 'INSERT INTO books (title, author, description, isbn, image) VALUES ($1, $2, $3, $4, $5) RETURNING id';
  const params = [request.body.title, request.body.author, request.body.description, request.body.isbn, request.body.image];
  console.log('is this thing on?');
  client.query(SQL, params)
  .then(results => {
      console.log(results);
      // response.status(200).redirect('pages/books');
      // results.row retrieves from db
      response.status(200).redirect(`/books/${results.rows[0].id}`);
    });
}

function newSearch(request, response) {
    response.status(200).render('pages/searches/new');
}

function bookSearch(request, response) {
    let search = request.body.search[0];
    let searchCategory = request.body.search[1];
    // let queryParams = {
    //   limit: 10
    // };

    let url = `https://www.googleapis.com/books/v1/volumes?q=`;
    if (searchCategory === 'title') {
        url += `+intitle:${search}`;
    }
    if (searchCategory === 'author') {
        url += `+inauthor:${search}`;
    }

  superagent.get(url)
    // .query(queryParams)
    .then(results => {
      let returned = results.body.items;
      let arr = returned.map((bookResults) => {
        return new Book(bookResults);
      });
      console.log(arr);
      response.status(200).render('pages/searches/show', { results: arr});
    });
}


// error handler
function errorHandler(request, response) {
    response.status(500).render('pages/error');
}

// constructor function
function Book(obj) {
  this.image = obj.volumeInfo.imageLinks ? obj.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = obj.volumeInfo.title ? obj.volumeInfo.title : 'Title not available';
  this.author = obj.volumeInfo.authors ? obj.volumeInfo.authors : 'Author(s) not available';
  this.description = obj.volumeInfo.description ? obj.volumeInfo.description : 'Description not available';
  this.isbn = obj.volumeInfo.industryIdentifiers.identifiers ? obj.volumeInfo.industryIdentifiers.identifiers  : 'ISBN not available';
}

// create our postgres client
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.log(err));
console.log(client.connectionParameters);

// start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));