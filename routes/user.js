const express = require("express");
const router = express.Router();
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

router.post("/login", function (req, res, next) {
  return login(req.body)
    .then((loginCheckData) => {
      if (!loginCheckData?.error && loginCheckData.username) {
        req.session.username = loginCheckData.username;
        req.session.realname = loginCheckData.realname;

        return res.json(new SuccessModel(loginCheckData));
      }
      return res.json(new ErrorModel(loginCheckData, "登录失败"));
    })
    .catch((error) => {
      return res.json(new ErrorModel({ error }, "登录失败"));
    });
});

router.get("/session-test", (req, res, next) => {
  const session = req.session;
  console.log(session, "sessionis")
  if (session.username) {
    res.json({
      errno: 0,
      msg: `测试成功${session.username}`,
    });
    return;
  }
  if (session.viewNum == null) {
    session.viewNum = 0;
  }
  session.viewNum++;
  res.json({
    viewNum: session.viewNum,
  });
});

module.exports = router;
