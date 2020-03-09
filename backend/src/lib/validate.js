const Joi = require("joi");

function isProperRequest(data, schema) {
  const result = Joi.validate(data, schema);

  // 검증 실패
  if (result.error) {
    // ctx.status = 400;
    // ctx.body = result.error;
    return result.error;
  } else return null;
}

function respondBadRequest(ctx, message) {
  ctx.throw(400, message.name);
}

module.exports = {
  isProperRequest,
  respondBadRequest
};
