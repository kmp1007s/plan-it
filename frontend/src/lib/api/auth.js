/**
 * 로그인 Request
 * @param {*} param0
 */
function login({ userId, pwd, subscription }) {
  return fetch("http://localhost:4000/api/auth/login", {
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
  }).then(res => {
    if (res.ok) return res.text();
    throw new Error("login Failed");
  });
}

/**
 * 로그아웃 Request
 */
function logout() {
  return fetch("http://localhost:4000/api/auth/logout", {
    method: "post",
    credentials: "include"
  }).then(res => {
    if (res.ok) return res;
    throw new Error("logout Failed");
  });
}

/**
 * 토큰 유효성 검사 Request
 */
function tokenCheck() {
  return fetch("http://localhost:4000/api/auth/check", {
    credentials: "include"
  }).then(res => {
    if (res.ok) return res.text();
    throw new Error("tokenCheck Failed");
  });
}

/**
 * 회원가입 Request
 * @param {*} userId
 * @param {*} pwd
 */
function register(userId, pwd) {
  return fetch("http://localhost:4000/api/auth/register", {
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      userId,
      pwd
    }),
    credentials: "include"
  }).then(res => {
    if (res.ok) return res.text();
    throw new Error("register Failed");
  });
}

export default {
  login,
  logout,
  tokenCheck,
  register
};
