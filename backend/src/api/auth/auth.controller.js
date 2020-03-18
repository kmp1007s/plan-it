const Joi = require("joi");
const Account = require("models/account");

/**
 * 회원가입
 */
exports.register = async ctx => {
  const schema = Joi.object().keys({
    userId: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),
    pwd: Joi.string()
      .required()
      .min(6)
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) return ctx.throw(400, error);

  let exisiting = null;

  try {
    exisiting = await Account.findByUserId(ctx.request.body.userId);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (exisiting) {
    ctx.status = 409;
    ctx.body = "Already UserID Exisits";
    return;
  }

  let account = null;

  try {
    account = await Account.register(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = account.userId;
};

/**
 * 아이디 중복 여부
 */
exports.exists = async ctx => {
  const { userId } = ctx.params;

  const schema = Joi.string()
    .alphanum()
    .min(4)
    .max(15)
    .required();

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) return ctx.throw(400, error);

  let account = null;

  try {
    account = await Account.findByUserId(userId);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: account !== null
  };
};

/**
 * 로그인
 */
exports.login = async ctx => {
  const schema = Joi.object().keys({
    userId: Joi.string()
      .alphanum()
      .min(4)
      .max(15)
      .required(),
    pwd: Joi.string()
      .required()
      .min(6),
    subscription: Joi.object().required()
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) return ctx.throw(400, error);

  const { userId, pwd, subscription } = ctx.request.body;

  let account = null;
  try {
    account = await Account.findByUserId(userId);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!account || !account.validatePassword(pwd)) {
    ctx.status = 403;
    return;
  }

  try {
    token = await account.generateToken(subscription);
  } catch (e) {
    ctx.throw(500, e);
  }

  // httpOnly 속성을 통해 네트워크 요청 시에 붙도록 함
  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    credentials: "include"
  });
  ctx.body = userId;
};

/**
 * 로그아웃
 */
exports.logout = ctx => {
  ctx.cookies.set("access_token", null, {
    maxAge: 0,
    httpOnly: true
  });
  ctx.status = 204;
};

/**
 * 토큰 체크
 */
exports.check = async ctx => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403; // Forbidden
    return;
  }

  const { userId } = user;

  let account = null;

  try {
    account = await Account.findByUserId(userId);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!account) return (ctx.status = 403);

  ctx.body = userId;
};
