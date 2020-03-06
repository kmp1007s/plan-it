// self.addEventListener("push", function(event) {
//   console.log("[Service Worker] Push Received.");
//   console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

//   const title = "Push Codelab";
//   const options = {
//     body: "Yay it works.",
//     icon: "images/icon.png",
//     badge: "images/badge.png"
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

self.addEventListener("push", function(event) {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const payload = event.data ? event.data.text() : "no payload";
  event.waitUntil(
    self.registration.showNotification("ServiceWorker Cookbook", {
      body: payload
    })
  );
});

self.addEventListener("install", function() {
  console.log("[Service Worker] Install");
});

self.addEventListener("activate", function() {
  console.log("[Service Worker] Activate");
});
