/**
 * 스케쥴 생성 Request
 * @param {*} param0
 */
function createSchedule({ date, startTime, finishTime, schedule }) {
  return fetch("http://localhost:4000/api/schedule/create", {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      date,
      startTime,
      finishTime,
      schedule
    }),
    credentials: "include" // 프론트에서 fetch할 때 credentials: true 옵션을 주고 백앤드에서 CORS_ALLOW_CREDNTIALS헤더를 True로 설정하면 제대로 작동한다
  }).then(res => {
    if (res.ok) return res.json();
    throw new Error("createSchedule Failed");
  });
}

/**
 * 스케쥴 가져오기 Request
 */
function getSchedules() {
  return fetch("http://localhost:4000/api/schedule/list", {
    credentials: "include"
  }).then(res => {
    if (res.ok) return res.json();
    throw new Error("getSchedules Failed");
  });
}

export default {
  createSchedule,
  getSchedules
};
