const Router = require("koa-router");
const api = new Router();

const auth = require("./auth");
const push = require("./push");
const schedule = require("./schedule");

api.use("/auth", auth.routes());
api.use("/push", push.routes());
api.use("/schedule", schedule.routes());

module.exports = api;
