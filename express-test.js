const express = require("./lib/express/like-express");

// 本次 http 请求的实例
const app = express();

app.use((req, res, next) => {
  console.log("请求开始...", req.method, req.url);
  console.log("是不是洋葱圈模型1 开始")
  next();
  console.log("是不是洋葱圈模型1 结束")
});

app.use((req, res, next) => {
  // 假设在处理 cookie
  req.cookie = {
    userId: "abc123",
  };
  console.log("是不是洋葱圈模型2 开始")
  next();
  console.log("是不是洋葱圈模型2 结束")
});

app.use((req, res, next) => {
  // 假设处理 post data
  // 异步
  console.log("异步请求开始");
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200,
    };
    console.log("异步请求结束");
    console.log(222222);
    next();
  }, 2000);
});

app.get("/", (req, res, next) => {
  console.log("处理 / 根路由");
  next();
});

app.use("/api", (req, res, next) => {
  console.log("处理 /api 路由");
  next();
});

app.get("/api", (req, res, next) => {
  console.log("get /api 路由");
  next();
  console.log("是不是洋葱圈模型")
});
app.post("/api", (req, res, next) => {
  console.log("post /api 路由");
  next();
});

// 模拟登录验证
function loginCheck(req, res, next) {
  setTimeout(() => {
    // console.log("模拟登陆失败");
    // res.json({
    //   errno: -1,
    //   msg: "登录失败",
    // });

    console.log("模拟登陆成功");
    next();
  });
}

const test = (req, res, next) => {
  console.log("测试代码");
  next();
};

app.get("/api/get-cookie", test, loginCheck, (req, res, next) => {
  console.log("get /api/get-cookie");
  res.json({
    errno: 0,
    data: req.cookie,
  });
});

app.post("/api/get-post-data", loginCheck, (req, res, next) => {
  console.log("post /api/get-post-data");
  res.json({
    errno: 0,
    data: req.body,
  });
});

app.use((req, res, next) => {
  console.log("处理 404");
  res.json({
    errno: -1,
    msg: "404 not fount",
  });
});

app.listen(7878, () => {
  console.log("server is running on port 7878");
});
