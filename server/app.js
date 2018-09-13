const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var cors = require('cors')
require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const quotesRouter = require('./routes/quotes');

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost/quotes', { useNewUrlParser: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB Connected!');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quotes', quotesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
