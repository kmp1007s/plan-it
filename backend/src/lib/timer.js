const webpush = require("web-push");
const timerIds = [];

function getTimerIds() {
  return timerIds;
}

function registerTimer(timerId) {
  timerIds.push(timerId);
  console.log("registerTimer: ", getTimerIds());
}

function clearAllTimers() {
  for (let timerId of timerIds) {
    clearTimeout(timerId);
    const idx = timerIds.indexOf(timerId);
    if (idx > -1) timerIds.splice(idx, 1);
  }
  console.log("clearAllTimers: ", getTimerIds());
}

function hourToMillisecond(h) {
  return h * 60 * 60 * 1000; // H -> M -> S -> MS = 3번의 변환
}

function minuteToMillisecond(m) {
  return m * 60 * 1000; // M -> S -> MS = 2번의 변환
}

function pushTimer(h, m, subscription, payload) {
  const d = new Date();

  const hToMs = hourToMillisecond(Number(h) - d.getHours());
  const mToMs = minuteToMillisecond(Number(m) - d.getMinutes());

  // 지연 시간이 0이거나 음수라면
  if (hToMs + mToMs < 1) return;

  console.log(hToMs + mToMs);

  const options = {
    TTL: 24 * 60 * 60,
    vapidDetails: {
      subject: "mailto:example_email@example.com",
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    }
  };

  const timerId = setTimeout(() => {
    webpush.sendNotification(subscription, payload, options);
    console.log(payload + "Push Sended");
  }, hToMs + mToMs);

  registerTimer(timerId);
}

module.exports = {
  pushTimer,
  getTimerIds,
  clearAllTimers
};
