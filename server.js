/* eslint-disable indent */
'use strict';

// bring in our dependencies

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

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

// test route
app.get('/hello', (request, response) => {
    const greeting = 'hellllllo';
    response.render('index', { greeting: greeting });
});

// search route
app.get('/searches/new', (request, response) => {
    console.log('hello');
    const title = request.query.title;
    const author = request.query.author;
    // const title = 'grace';
    // const author = 'cody';
    // response.status(200).send(title + ' ' + author);
    response.render('pages/searches/new', { author: author});
});

// start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));