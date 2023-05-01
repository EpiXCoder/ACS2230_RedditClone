// Require stuff here
require('dotenv').config();
const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/checkAuth');

const express = require('express');
// import express from 'express';
const handlebars = require('express-handlebars');
// import handlebars from 'express-handlebars';

const app = express();
app.use(express.static('public'));
app.use(cookieParser());

// Set db
require('./data/reddit-db.js');


// Middleware

const hbs = handlebars.create({
    helpers: {}
});

// App config
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(checkAuth);

// Require controllers
require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);
// require('./controllers/users')(app);

// Routes
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/posts/new', (req, res) => {
  console.log("posting!")
  res.render('posts-new');
});

app.get('/users/new', (req, res) => {
  console.log("making a user!")
  res.render('users-new'); 
});

app.listen(3000, () => {
  console.log('Reddit Clone listening on port localhost:3000!');
});

module.exports = app;