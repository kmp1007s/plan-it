import React from "react";
import logo from "./logo.svg";
import "./App.css";

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

let myServiceWorker;
let mySubscription;

window.onload = async function() {
  if (!"serviceWorker" in navigator || !"PushManager" in window) {
    console.log("Not Supported Version");
    return;
  }

  const sw = `${process.env.PUBLIC_URL}/service-worker.js`;
  const registration = await navigator.serviceWorker.register(sw);
  await navigator.serviceWorker.ready;

  console.log("Register Success");
  myServiceWorker = registration;

  const subscription = await registration.pushManager.getSubscription();
  console.log("Previous Subscription: ", subscription);

  // 이미 구독했다면
  if (subscription) {
    console.log("Already Subscription Exists");
    return;
  }

  console.log("No Subscription");
  const newSubscription = await subscribe(registration);
  updateSubscriptionOnServer(newSubscription);
};

async function subscribe(registration) {
  const response = await fetch("http://localhost:4000/api/push/vapidPublicKey");
  const vapidPublicKey = await response.text();
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  });
  mySubscription = subscription;

  console.log("Subscribe Success");
  return subscription;
}

async function updateSubscriptionOnServer(subscription) {
  if (subscription) {
    // 서버로 push subscription을 전송
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

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <p>
        payload
        <input type="text" id="payload" />
      </p>
      <button
        onClick={() => {
          const payload = document.getElementById("payload").value;

          setTimeout(() => {
            fetch("http://localhost:4000/api/push/sendNotification", {
              method: "post",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                subscription: mySubscription,
                payload: payload
              })
            })
              .then(() => {
                console.log("send push success");
              })
              .catch(ex => {
                console.error(ex);
              });
          }, 4000);
        }}
      >
        Send
      </button>
      <button
        onClick={() => {
          console.log(myServiceWorker);
          myServiceWorker.pushManager.getSubscription().then(subscription => {
            console.log("[check] ", subscription);
          });
        }}
      >
        체크
      </button>
    </div>
  );
}

export default App;
