const Router = require("koa-router");
const schedule = new Router();

const scheduleCtrl = require("./schedule.controller");

schedule.get("/list", scheduleCtrl.list);
schedule.post("/create", scheduleCtrl.create);

module.exports = schedule;
