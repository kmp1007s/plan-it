const webpush = require("web-push");
const timerIds = [];

/**
 * 등록된 타이머의 갯수 반환
 */
function timerIdsLength() {
  return timerIds.length;
}

/**
 * 타이머목록에 등록
 * @param {*} timerId
 */
function registerTimer(timerId) {
  timerIds.push(timerId);
}

/**
 * 모든 타이머를 정리
 */
function clearAllTimers() {
  console.log("Start ClearAllTimers");

  return new Promise(resolve => {
    if (timerIds.length === 0) {
      console.log("No Timers To Clear: ", timerIds.length);
      resolve(timerIds.length);
    }

    for (let timerId of timerIds) {
      clearTimeout(timerId);

      const idx = timerIds.indexOf(timerId);
      if (idx > -1) timerIds.splice(idx, 1);

      if (timerIds.length === 0) {
        console.log("After ClearTimers Length: ", timerIds.length);
        resolve(timerIds.length);
      }
    }
  });
}

/**
 * hour을 ms단위로 변환
 * @param {*}} h
 */
function hourToMillisecond(h) {
  return h * 60 * 60 * 1000; // H -> M -> S -> MS = 3번의 변환
}

/**
 * minute을 ms단위로 변환
 * @param {*}} m
 */
function minuteToMillisecond(m) {
  return m * 60 * 1000; // M -> S -> MS = 2번의 변환
}

/**
 * 타이머를 등록, 푸쉬 예약
 * @param {*} h
 * @param {*} m
 * @param {*} subscription
 * @param {*} payload
 */
function pushTimer(h, m, subscription, payload) {
  const d = new Date();

  const hToMs = hourToMillisecond(Number(h) - d.getHours());
  const mToMs = minuteToMillisecond(Number(m) - d.getMinutes());

  // 지연 시간이 0이거나 음수라면
  if (hToMs + mToMs < 1) return;

  console.log(
    `${hToMs + mToMs - d.getSeconds() * 1000}ms 후 ${payload} 푸쉬알림 전송`
  );

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
    console.log(payload + " Push Sended");
  }, hToMs + mToMs - d.getSeconds() * 1000);

  registerTimer(timerId);
}

module.exports = {
  pushTimer,
  timerIdsLength,
  clearAllTimers
};
