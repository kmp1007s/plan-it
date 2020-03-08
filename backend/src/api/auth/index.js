const Router = require("koa-router");
const auth = new Router();
const authCtrl = require("./auth.controller");

auth.post("/register", authCtrl.register);
auth.post("/login", authCtrl.login);
auth.get("/exists/:userId", authCtrl.exists);
auth.post("/logout", authCtrl.logout);
auth.get("/check", authCtrl.check);

module.exports = auth;
