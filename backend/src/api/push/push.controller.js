require("dotenv").config();
const webpush = require("web-push");
const Subscription = require("models/subscription");

exports.vapidPublicKey = ctx => {
  console.log("[vapidPublicKey]");
  ctx.body = process.env.VAPID_PUBLIC_KEY;
};

exports.register = ctx => {
  console.log("[register]", ctx.request.body);
  /* TODO: store the subscription */

  // // subscription 인스턴스 생성
  // const subscription = new Subscription({
  //   subscription,
  //   keys
  // });

  // try {
  //   await subscription.save();

  // } catch(ex) {
  //   console.error(ex);
  //   return ctx.throw(500, ex);
  // }

  ctx.response.status = 201;
};

exports.sendNotification = async ctx => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403; // Forbidden
    return;
  }

  console.log("[sendNotification]");

  const requestBody = ctx.request.body;

  const subscription = user.subscription;
  const payload = requestBody.payload;
  const options = {
    TTL: 24 * 60 * 60,
    vapidDetails: {
      subject: "mailto:example_email@example.com",
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    }
  };

  // then 방식에서는 sendNotification을 수행하고 먼저 response를 보내는 것으로 보임 404 에러가 뜸
  // await 키워드로 기다린 다음에 status를 보냄
  await webpush.sendNotification(subscription, payload, options);
  ctx.response.status = 201;

  // webpush
  //   .sendNotification(subscription, payload, options)
  //   .then(() => {
  //     ctx.response.status = 201;
  //   })
  //   .catch(ex => {
  //     console.log(ex);
  //     ctx.response.status = 500;
  //   });
};
