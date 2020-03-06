require("dotenv").config();

const webpush = require("web-push");

exports.vapidPublicKey = ctx => {
  console.log("[vapidPublicKey]");
  ctx.body = process.env.VAPID_PUBLIC_KEY;
};

exports.register = ctx => {
  console.log("[register]");
  ctx.response.status = 201;
};

exports.sendNotification = ctx => {
  console.log("[sendNotification]");

  const reqBody = ctx.request.body;

  const subscription = reqBody.subscription;
  const payload = reqBody.payload;
  const options = {
    TTL: 24 * 60 * 60,
    vapidDetails: {
      subject: "mailto:example_email@example.com",
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    }
  };

  webpush
    .sendNotification(subscription, payload, options)
    .then(() => {
      ctx.response.status = 201;
    })
    .catch(ex => {
      console.log(ex);
      ctx.response.status = 500;
    });
};
