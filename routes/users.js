const express = require('express');
const router = express.Router();
const db = require('../models/index');
const csrf = require('csurf');
const nodemailer = require('nodemailer');

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
    .then(user => {
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

router.get('/forget-pass', (req, res, next) => {
  var data = {
     title:'パスワード確認画面',
     content:'入力いただいたメールアドレス宛に、パスワードをお送りいたします。'
  }
  res.render('users/forget-pass', data);
});

router.post('/forget-pass', (req, res, next) => {
  db.User.findOne({
    where:{
      mail:req.body.mail,
    }
  }).then(user=>{
    if (user != null) {
      const smtp = nodemailer.createTransport({
        port: 25,
        host: 'localhost',
        tls: {
          rejectUnauthorized: false
        },
      });

      const message = {
        from: 'From:Simple-login',
        to: '${user.mail}',
        text: "パスワードは${user.pass}です。",
        subject: 'Simple-loginよりパスワードのご連絡です。',
      };

      smtp.sendMail(message, (error, info) => {
        if(error) {
          console.log(error);
        } else {
          console.log(info);
        }
      });

      var data = {
        title:'ログイン画面',
        content:'メールアドレスにパスワードをお送りしました。'
      }
      res.render('users/login', data);
    } else {
      var data = {
        title:'パスワード確認画面',
        content:'メールアドレスに問題があります。'
      }
      res.render('users/forget-pass', data);
    }
  })
});

module.exports = router;
