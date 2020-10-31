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
// app.use(express.static('./views'));

// set default view engine and what we're using to view (ejs)
app.set('view engine', 'ejs');

// test route
app.get('/hello', (request, response) => {
    const greeting = 'hellllllo';
    response.render('index', { greeting: greeting });
});

// start our server
app.listen(PORT, () => console.log(`Now listening on port ${PORT}.`));