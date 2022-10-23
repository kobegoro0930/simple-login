require('dotenv').config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'Kwp7JT36WWhz',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

// CSRF対策
app.use((req, res, next) => {
  const method = req.method;
  if(method === 'GET') {
    let csrfToken = crypto.randomBytes(20).toString('hex');
    req.session.csrfToken = csrfToken;
    app.locals = {csrfToken: csrfToken};
  } else if(['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    if(req.body._token !== req.session.csrfToken) {
      return res.status(419).send('不正なアクセスです。');
    }
  }
  next();
});

//ログイン確認
app.use((req, res, next) => {
  const url = req.url;
  if (url == "/" || url == "/users/") {
    if (req.session.login == null) {
      req.session.back = url;
      res.redirect('/users/login');
      return true;
    }
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
