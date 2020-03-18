require("dotenv").config();

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const pushLib = require("./lib/push");
const mongoose = require("mongoose");
const api = require("./api");
const { jwtMiddleware } = require("lib/token");

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 4000; // PORT 설정이 없다면 4000을 기본값

mongoose.Promise = global.Promise; // NODE의 Promise 사용
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // Node Warning(Deprecation)
    useUnifiedTopology: true // Node Warning(Deprecation)
  })
  .then(response => {
    console.log("Successfully Connected To MongoDB");
  })
  .catch(ex => {
    console.error("Failed Connected to MongoDB");
    console.error(ex);
  });

router.use("/api", api.routes()); // api 라우트를 /api 하위 경로로 설정

app
  .use(cors({ origin: false, credentials: true })) // 자격증명 true
  .use(bodyParser()) // bodyParser는 라우터 코드보다 상단에 위치
  .use(jwtMiddleware)
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  console.log("Server is listening to port 4000");
  pushLib.setVapidKey();
});
