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
  await navigator.serviceWorker.ready; // serviceworker를 등록하고 active 단계가 될 때까지 실행을 기다림

  console.log("Register Success");
  myServiceWorker = registration;
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
          onClick={async () => {
            const userId = document.getElementById("userId").value;
            const pwd = document.getElementById("pwd").value;
            let subscription;

            const oldSubscription = await myServiceWorker.pushManager.getSubscription();
            console.log("Previous Subscription: ", oldSubscription);

            // 이미 구독했다면
            if (oldSubscription) {
              console.log("Already Subscription Exists");
              subscription = oldSubscription;
            } else {
              console.log("No Subscription");
              const newSubscription = await subscribeLib.subscribe(
                myServiceWorker
              );
              subscription = newSubscription;
              subscribeLib.updateSubscriptionOnServer(newSubscription);
            }

            // const subscription = mySubscription;

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
      <p>
        스케쥴
        <input type="text" id="schedule" />
        시작 시간
        <input type="text" id="startTime" />
        끝나는 시간
        <input type="text" id="finishTime" />
        <button
          onClick={async () => {
            let startTimeInput = document.getElementById("startTime").value;
            let finishTimeInput = document.getElementById("finishTime").value;
            const schedule = document.getElementById("schedule").value;

            const startTime = startTimeInput.split(":");
            const startTimeHour =
              startTime[0] < 10 && startTime[0].length < 2
                ? `0${startTime[0]}`
                : startTime[0];
            const startTimeMin =
              startTime[1] < 10 && startTime[1].length < 2
                ? `0${startTime[1]}`
                : startTime[1];

            const finishTime = finishTimeInput.split(":");
            const finishTimeHour =
              finishTime[0] < 10 && finishTime[0].length < 2
                ? `0${finishTime[0]}`
                : finishTime[0];
            const finishTimeMin =
              finishTime[1] < 10 && finishTime[1].length < 2
                ? `0${finishTime[1]}`
                : finishTime[1];

            const sendStartDate = `${startTimeHour}:${startTimeMin}`;
            const sendFinishDate = `${finishTimeHour}:${finishTimeMin}`;

            const d = new Date();
            const date = `${d.getFullYear()}/${d.getMonth()}/${d.getDay()}`;
            console.log(date, sendStartDate, sendFinishDate, schedule);

            fetch("http://localhost:4000/api/schedule/create", {
              method: "post",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                date,
                startTime: sendStartDate,
                finishTime: sendFinishDate,
                schedule
              }),
              credentials: "include" // 프론트에서 fetch할 때 credentials: true 옵션을 주고 백앤드에서 CORS_ALLOW_CREDNTIALS헤더를 True로 설정하면 제대로 작동한다
            })
              .then(res => {
                console.log("Upload Success", res.json());
              })
              .catch(ex => {
                console.error(ex);
              });
          }}
        >
          등록
        </button>
      </p>
      <p>
        스케쥴 리스트 가져오기
        <button
          onClick={() => {
            fetch("http://localhost:4000/api/schedule/list", {
              credentials: "include"
            })
              .then(res => {
                console.log("Fetch Schedule Success", res.json());
              })
              .catch(ex => {
                console.error(ex);
              });
          }}
        >
          가져오기
        </button>
      </p>
    </div>
  );
}

export default App;
