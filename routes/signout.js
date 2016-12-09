let express = require('express');
let router = express.Router();

let checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
	//清空 session 中用户信息
	req.session.user = null;

  res.send(req.flash('success','登出成功'));
  //登出成功后跳转到主页
  res.redirect('/posts');
});

module.exports = router;