require("dotenv").config();

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const app = new Koa();
const router = new Router();
const api = require("./api");

const pushLib = require("./lib/push");

const PORT = process.env.PORT || 4000; // PORT 설정이 없다면 4000을 기본값

router.use("/api", api.routes()); // api 라우트를 /api 하위 경로로 설정

app
  .use(cors())
  .use(bodyParser()) // bodyParser는 라우터 코드보다 상단에 위치
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT, () => {
  console.log("Server is listening to port 4000");
  pushLib.setVapidKey();
});
