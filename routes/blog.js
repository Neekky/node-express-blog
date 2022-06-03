const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog");
const { SuccessModel, ErrorModel } = require("../model/resModel");
const { loginCheck } = require("../util");

const express = require("express");
const router = express.Router();

router.get("/list", (req, res, next) => {
  if (req.query.isadmin) {
    const loginCheckRes = loginCheck(req);
    if (loginCheckRes) {
      // 未登录
      return res.json(loginCheckRes);
    }
    // 强制查自己的博客
    req.query.author = req.session.username;
  }

  return getList(req.query)
    .then((listData) => {
      if (!listData.error) {
        res.json(new SuccessModel(listData));
        return;
      }
      res.json(new ErrorModel(listData));
      return;
    })
    .catch((error) => {
      res.json(new ErrorModel(error));
      return;
    });
});

router.get("/detail", (req, res, next) => {
  return getDetail(req.query)
    .then((detailData) => {
      if (!detailData.error) {
        return res.json(new SuccessModel(detailData));
      }
      return res.json(new ErrorModel(detailData));
    })
    .catch((error) => {
      return res.json(new ErrorModel({ error }));
    });
});

router.post("/new", (req, res, next) => {
  // 登录校验
  const loginCheckRes = loginCheck(req);
  if (loginCheckRes) return res.json(loginCheckRes);

  req.body.author = req.session.username;
  return newBlog(req.body)
    .then((newBlogData) => {
      if (!newBlogData.error) {
        return res.json(new SuccessModel(newBlogData));
      }
      return res.json(new ErrorModel(newBlogData));
    })
    .catch((error) => {
      return res.json(new ErrorModel({ error }));
    });
});

router.post("/update", (req, res, next) => {
  // 登录校验
  const loginCheckRes = loginCheck(req);
  if (loginCheckRes) return res.json(loginCheckRes);
  return updateBlog({ ...req.body, ...req.query })
    .then((updateBlogData) => {
      if (!updateBlogData?.error) {
        return updateBlogData
          ? res.json(new SuccessModel(updateBlogData))
          : res.json(new ErrorModel(updateBlogData));
      }
      return res.json(new ErrorModel(updateBlogData));
    })
    .catch((error) => {
      return res.json(new ErrorModel({ error }));
    });
});

router.post("/del", (req, res, next) => {
  // 登录校验
  const loginCheckRes = loginCheck(req);
  if (loginCheckRes) return res.json(loginCheckRes);

  const author = req.session.username;
  const id = req.query.id;
  return delBlog(id, author)
    .then((delBlogData) => {
      if (!delBlogData?.error) {
        return delBlogData
          ? res.json(new SuccessModel(delBlogData))
          : res.json(new ErrorModel(delBlogData, "删除博客失败"));
      }
      return res.json(new ErrorModel(delBlogData));
    })
    .catch((error) => {
      return res.json(new ErrorModel({ error }));
    });
});

module.exports = router;
