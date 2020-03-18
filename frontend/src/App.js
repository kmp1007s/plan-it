import React, { useEffect } from "react";
import "./App.css";
import subscribeLib from "lib/subscribe";
import { useDispatch, useSelector } from "react-redux";
import { registerSW } from "modules/subscribe";
import MainPage from "pages/MainPage";
import PleaseLoginPage from "pages/PleaseLoginPage";
import { validateToken } from "modules/auth";

window.onload = async function() {
  if (!subscribeLib.isServiceWokrerSupported()) {
    console.log("ServiceWorker No Supported");
    return;
  }

  if (!subscribeLib.askPermission()) {
    console.log("Please grant the permission to use this service");
    return;
  }
};

function App() {
  const { isLogin, userId } = useSelector(({ auth }) => ({
    isLogin: auth.login,
    userId: auth.userId
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    const sw = `${process.env.PUBLIC_URL}/service-worker.js`;
    dispatch(registerSW(sw));
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <div className="App">
      {isLogin ? <MainPage userId={userId} /> : <PleaseLoginPage />}
    </div>
  );
}

export default App;
