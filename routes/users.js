const express = require('express');
const router = express.Router();
const db = require('../models/index');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const url = require('url');

router.get('/',(req, res, next)=> {
  db.User.findAll().then(users => {
    var data = {
      title: 'メンバー一覧',
      content: users
    }
    res.render('users/index', data);
  });
});

router.get('/new', (req, res, next)=> {
  var data = {
    title: '新規登録',
    content: '登録内容を入力してください。',
    form: {name: '', mail: '', message: ''}
  }
  res.render('users/new', data);
});

router.post('/new', [
  check('name', '名前を入力してください。').notEmpty().escape(),
  check('mail', 'メールアドレスを正しく入力してください。').isEmail().escape(),
  check('mail').custom(value => {
    return db.User.count({
      where: {mail: value}
    }).then(userCount => {
      if(userCount > 0) {
        throw new Error('このメールアドレスはすでに登録されています。');
      }
    });
  }),
  check('pass', 'パスワードを入力してください。').notEmpty().escape(),
  check('message', '一言メッセージを入力してください。').notEmpty().escape()
], (req, res, next)=> {

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    let result = '<ul>';
    let result_arr = errors.array();
    for(var n in result_arr) {
      result += `<li>${result_arr[n].msg}</li>`
    }
    result += '</ul>';
    var data = {
      title: '新規登録',
      content: result,
      form: req.body
    }
    res.render('users/new', data);
  } else {
    const hashPassword =  bcrypt.hashSync(req.body.pass, 10);
    db.sequelize.sync()
      .then(() => db.User.create({
        name: req.body.name,
        mail: req.body.mail,
        pass: hashPassword,
        message: req.body.message
      }))
      .then(user => {
        res.redirect('/users/login');
      });
  }
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
    where:{mail: req.body.mail}
  }).then(user=>{
    if (user != null && bcrypt.compareSync(req.body.pass, user.pass)) {
      req.session.login = user;
      let back = req.session.back;
      if (back == null){
        back = '/';
      }
      req.session.back = null;
      res.redirect(back);
    } else {
      var data = {
        title:'ログイン画面',
        content:'メールアドレスかパスワードに問題があります。'
      }
      res.render('users/login', data);
    }
  });
});

router.get('/forget-pass', (req, res, next) => {
  var data = {
     title:'パスワードをお忘れの方',
     content:'入力いただいたメールアドレス宛に、パスワード再設定のリンクをお送りします。'
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
      let passwordResetToken = crypto.randomBytes(20).toString('hex');
      req.session.passwordResetToken = passwordResetToken;
      const smtp = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

      const mailOptions = {
        to: user.mail,
        subject: 'Simple-loginよりパスワード再設定リンクのご案内です。',
        html: `<p>下記のリンクよりパスワードの再設定を行なってください。</p><p><a href="http://localhost:3000/users/reset-pass?token=${passwordResetToken}&mail=${req.body.mail}">パスワード再設定リンク</a></p>`
      };

      smtp.sendMail(mailOptions, (error, info) => {
        if(error) {
          console.log(error);
        } else {
          console.log(info);
        }
      });

      var data = {
        title:'パスワードをお忘れの方',
        content:'メールアドレスにパスワードをお送りしました。ご確認をお願いいたします。'
      }
      res.render('users/forget-pass', data);
    } else {
      var data = {
        title:'パスワードをお忘れの方',
        content:'入力されたメールアドレスの登録が見つかりません。'
      }
      res.render('users/forget-pass', data);
    }
  })
});

router.get('/reset-pass', (req, res, next) => {
  const url_parts = url.parse(req.url, true);
  var data = {
     title:'パスワード再設定画面',
     content:'再設定するパスワードを入力してください。',
     mail: url_parts.query.mail,
     passwordResetToken: url_parts.query.token
  }
  res.render('users/reset-pass', data);
});

router.post('/reset-pass', [
  check('pass', 'パスワードを入力してください。').notEmpty().escape(),
  check('confirm').custom((value, { req }) => {
    if (value !== req.body.pass) {
      throw new Error('パスワードが一致しません。');
    } else {
      return true;
    }
  })
], (req, res, next)=> {

  if(req.body._resetToken !== req.session.passwordResetToken) {
    return res.status(419).send('不正なアクセスです。');
  }
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    let result = '<ul>';
    let result_arr = errors.array();
    for(var n in result_arr) {
      result += `<li>${result_arr[n].msg}</li>`
    }
    result += '</ul>';
    var data = {
      title: 'パスワード再設定画面',
      content: result,
      mail: req.body.mail,
      passwordResetToken: req.body._resetToken
    }
    res.render('users/reset-pass', data);
  } else {
    const hashPassword =  bcrypt.hashSync(req.body.pass, 10);
    db.sequelize.sync()
      .then(() => db.User.update({
        pass: hashPassword
      }, {
        where: {mail: req.body.mail}
      }))
      .then(user => {
        res.redirect('/users/login');
      });
  }
});

module.exports = router;
