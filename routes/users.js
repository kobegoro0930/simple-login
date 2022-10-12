const express = require('express');
const router = express.Router();
const db = require('../models/index');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: false });

router.get('/',(req, res, next)=> {
  if (req.session.login == null) {
    req.session.back = '/users/';
    res.redirect('/users/login');
    return true;
  }
  db.User.findAll().then(users => {
    var data = {
      title: 'メンバー一覧',
      content: users
    }
    res.render('users/index', data);
  });
});

router.get('/new', csrfProtection, (req, res, next)=> {
  var data = {
    title: '新規登録',
    csrfToken: req.csrfToken()
  }
  res.render('users/new', data);
});

router.post('/new', csrfProtection, (req, res, next)=> {
  db.sequelize.sync()
    .then(() => db.User.create({
      name: req.body.name,
      mail: req.body.mail,
      pass: req.body.pass,
      message: req.body.message
    }))
    .then(usr => {
      res.redirect('/users');
    });
});

router.get('/login', (req, res, next) => {
  var data = {
     title:'ログイン画面',
     content:'メールアドレスとパスワードを入力して下さい。'
  }
  res.render('users/login', data);
});

router.post('/login', (req, res, next) => {
  db.User.findOne({
    where:{
      mail:req.body.mail,
      pass:req.body.pass,
    }
  }).then(user=>{
    if (user != null) {
      req.session.login = user;
      let back = req.session.back;
      if (back == null){
        back = '/';
      }
      res.redirect(back);
    } else {
      var data = {
        title:'ログイン画面',
        content:'メールアドレスかパスワードに問題があります。'
      }
      res.render('users/login', data);
    }
  })
});

module.exports = router;
