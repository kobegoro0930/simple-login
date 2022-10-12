var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.login == null) {
    req.session.back = '/';
    res.redirect('/users/login');
    return true;
  }
  res.render('index', { title: 'Simple-login' });
});

module.exports = router;
