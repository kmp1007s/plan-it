const Router = require("koa-router");
const api = new Router();

const push = require("./push");

api.use("/push", push.routes());

module.exports = api;
