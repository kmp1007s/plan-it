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

let mySubscription;

window.onload = async () => {
  console.log("App Loaded");

  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  navigator.serviceWorker.register(swUrl).then(() => {
    console.log("Register Success");
  });

  navigator.serviceWorker.ready
    .then(registration => {
      console.log("Ready");

      var serviceWorker;

      if (registration.installing) {
        serviceWorker = registration.installing;
        console.log("Service worker installing");
      } else if (registration.waiting) {
        serviceWorker = registration.waiting;
        console.log("Service worker installed & waiting");
      } else if (registration.active) {
        serviceWorker = registration.active;
        console.log("Service worker active");
      }

      if (serviceWorker) {
        console.log("sw current state", serviceWorker.state);
        if (serviceWorker.state == "activated") {
          //If push subscription wasnt done yet have to do here
          console.log("sw already activated - Do watever needed here");
        }
        serviceWorker.addEventListener("statechange", function(e) {
          console.log("sw statechange : ", e.target.state);
          if (e.target.state == "activated") {
            // use pushManger for subscribing here.
            console.log(
              "Just now activated. now we can subscribe for push notification"
            );
          } else if (e.target.state == "redundant") {
            console.log("ServiceWorker's state is redundant");
          }
        });
      }

      return registration.pushManager
        .getSubscription()
        .then(async subscription => {
          console.log("GetSubscription Complete");

          if (subscription) {
            console.log("Already Subscription Exists");
            return subscription;
          }

          console.log("No Subscription");

          const response = await fetch(
            "http://localhost:4000/api/push/vapidPublicKey"
          );
          console.log(response);
          const vapidPublicKey = await response.text();
          console.log(vapidPublicKey);

          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
          console.log(convertedVapidKey);

          // push subscription을 생성
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        });
    })
    .then(pushSub => {
      console.log(pushSub);

      // 서버로 push subscription을 전송
      fetch("http://localhost:4000/api/push/register", {
        method: "post",
        headers: {
          "Content-type": "application-json"
        },
        body: JSON.stringify({
          subscription: pushSub
        })
      });

      mySubscription = pushSub;
    });
};

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

          console.log(
            JSON.stringify({
              subscription: mySubscription,
              payload: payload
            })
          );

          fetch("http://localhost:4000/api/push/sendNotification", {
            method: "post",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              subscription: mySubscription,
              payload: payload
            })
          });
        }}
      >
        Send
      </button>
    </div>
  );
}

export default App;
