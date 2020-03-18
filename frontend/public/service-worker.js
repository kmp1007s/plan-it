/* 
서비스워커의 생명주기
1. register
2. installing -> 
  1. event.waitUnitil()로 작업이 설치 작업이 마무리 될 때 까지 설치 단계를 연장
  2. self.skipWaiting()로 기존 서비스워커의 종료를 대기하지 않고 새 서비스워커를 바로 활성화
3. installed 설치작업이 마무리 되면 기존 서비스워커를 사용하는 클라이언트가 닫히기까지 대기 -> 처음 서비스워커를 등록하는 과정이면 대기 없이 다음 과정으로 전환
4. activating 이전 서비스워커가 캐싱한 데이터를 지우는 등 정리작업을 수행, event.waitUntil()을 통해 연장가능
5. 이제 서비스워커는 activated push, fetch 등 기능적인 이벤트를 처리할 수 있음
6. 서비스워커 변경 -> 작동중이던 서비스워커는 여전히 동작, 서비스워커를 사용하는 클라이언트(보고있는 웹 페이지)가 모두 종료되면 새로운 서비스워커로 대체
새 서비스워커 설치 과정에서 self.skipWaiting()이 사용되었다면 바로 대체

등록 -> 설치 -> 활성화 -> 기능 제어
*/

const log = msg => {
  console.log(`[ServiceWorker] ${msg}`);
};

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  clients.openWindow("localhost:3000");
});

self.addEventListener("push", function(event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const payload = event.data ? event.data.text() : "no payload";
  event.waitUntil(
    self.registration.showNotification("PlanNET[플랜잇]", {
      body: payload
    })
  );
});

self.addEventListener("install", function(e) {
  log("INSTALL");
  self.skipWaiting(); // skipWaiting을 통해 새로 regsiter하는 serviceworker를 이전의 serviceworker가 종료될 때까지 기다리지 않고 바로 활성화
});

self.addEventListener("activate", function(e) {
  log("ACTIVATE");
});

// self.addEventListener("fetch", function(e) {
//   log("Fetch " + e.request.url);
// });
