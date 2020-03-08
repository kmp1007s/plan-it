const Router = require("koa-router");
const api = new Router();

const auth = require("./auth");
const push = require("./push");

api.use("/auth", auth.routes());
api.use("/push", push.routes());

module.exports = api;
