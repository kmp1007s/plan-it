const Router = require("koa-router");
const push = new Router();

const pushCtrl = require("./push.controller");

push.get("/vapidPublicKey", pushCtrl.vapidPublicKey);
push.post("/register", pushCtrl.register);
push.post("/sendNotification", pushCtrl.sendNotification);

module.exports = push;
