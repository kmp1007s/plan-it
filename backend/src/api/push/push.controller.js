const webpush = require("web-push");

/**
 * 공개키 가져오기
 */
exports.vapidPublicKey = ctx => {
  console.log("[vapidPublicKey]");
  ctx.body = process.env.VAPID_PUBLIC_KEY;
};

/**
 * 공개키를 서버측에서 저장 (이 앱에는 불필요)
 */
exports.register = ctx => {
  /* TODO: store the subscription */
};

/**
 * Push Notification 테스트용
 */
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
