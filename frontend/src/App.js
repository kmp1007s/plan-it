import React from "react";
import logo from "./logo.svg";
import "./App.css";
import subscribeLib from "lib/subscribe";

let myServiceWorker;
let mySubscription;

window.onload = async function() {
  if (!subscribeLib.isServiceWokrerSupported()) {
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
    mySubscription = subscription;
    return;
  }

  console.log("No Subscription");
  const newSubscription = await subscribeLib.subscribe(registration);
  mySubscription = newSubscription;
  subscribeLib.updateSubscriptionOnServer(newSubscription);
};

function App() {
  return (
    <div className="App">
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
                payload: payload
              }),
              credentials: "include"
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
      <p>
        userId: <input type="text" id="userId" />
        pwd: <input type="text" id="pwd" />
        <button
          onClick={() => {
            const userId = document.getElementById("userId").value;
            const pwd = document.getElementById("pwd").value;
            const subscription = mySubscription;

            fetch("http://localhost:4000/api/auth/login", {
              method: "post",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                userId,
                pwd,
                subscription
              }),
              credentials: "include" // 프론트에서 fetch할 때 credentials: true 옵션을 주고 백앤드에서 CORS_ALLOW_CREDNTIALS헤더를 True로 설정하면 제대로 작동한다
            })
              .then(res => {
                console.log("Login Success", res.text());
              })
              .catch(ex => {
                console.error(ex);
              });
          }}
        >
          로그인 테스트
        </button>
        <button
          onClick={() => {
            fetch("http://localhost:4000/api/auth/check", {
              credentials: "include"
            })
              .then(res => {
                console.log("Token Check Success", res.json());
              })
              .catch(ex => {
                console.error(ex);
              });
          }}
        >
          토큰 체크
        </button>
      </p>
    </div>
  );
}

export default App;
