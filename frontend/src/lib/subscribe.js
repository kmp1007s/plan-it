/**
 * 브라우저가 ServiceWorker와 PushManager를 지원하는 지 확인
 */
function isServiceWokrerSupported() {
  if ("serviceWorker" in navigator && "PushManager" in window) return true;
  else return false;
}

/**
 * Notification 권한 요청
 */
async function askPermission() {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") return false;
  return true;
}

/**
 * 크롬 지원을 위한 파싱 메소드
 * @param {base64String} base64String
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * VAPID공개키를 받아와서 Uint8Array로 변환 후 반환
 */
async function getVAPIDPublicKey() {
  const response = await fetch("http://localhost:4000/api/push/vapidPublicKey");
  const vapidPublicKey = await response.text();
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  return convertedVapidKey;
}

/**
 * 전달받은 service-worker registration을 서버에 구독시킨다
 * @param {ServiceWorkerRegistration} registration
 */
async function subscribe(registration) {
  const applicationServerKey = await getVAPIDPublicKey();

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey
  });

  console.log("Subscribe Success");
  return subscription;
}

/**
 * 서버로 Subscription을 전송
 * @param {PushSubscription} subscription
 */
async function updateSubscriptionOnServer(subscription) {
  if (subscription) {
    await fetch("http://localhost:4000/api/push/register", {
      method: "post",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        subscription
      })
    });
    console.log("Update Subscription Success");
  } else console.error("No Subscription Send To Server");
}

/**
 * ServiceWorker를 register한다
 * @param {String} swUrl
 */
async function registerSW(swUrl) {
  const registration = await navigator.serviceWorker.register(swUrl);
  await navigator.serviceWorker.ready; // serviceworker를 등록하고 active 단계가 될 때까지 실행을 기다림
  return registration;
}

export default {
  subscribe,
  updateSubscriptionOnServer,
  isServiceWokrerSupported,
  getVAPIDPublicKey,
  askPermission,
  registerSW
};
