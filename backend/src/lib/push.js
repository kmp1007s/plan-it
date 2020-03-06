const webpush = require("web-push");

function setVapidKey() {
  // VAPID KEY 환경변수가 존재하지 않는다면 env 파일에 새로 기록
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    const vapidKeys = webpush.generateVAPIDKeys();
    process.env.VAPID_PUBLIC_KEY = vapidKeys.publicKey;
    process.env.VAPID_PRIVATE_KEY = vapidKeys.privateKey;
    console.log("new VAPID_KEY", vapidKeys);
  } else console.log("env VAPID_KEY", process.env.VAPID_PUBLIC_KEY);
}

module.exports = {
  setVapidKey
};
