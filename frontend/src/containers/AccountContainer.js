import React from "react";
import AccountForm from "components/AccountForm";
import { useSelector, useDispatch } from "react-redux";
import subscribeLib from "lib/subscribe";
import { login } from "modules/auth";
import authApi from "lib/api/auth";

const AccountContainer = ({ closeAccountForm }) => {
  const dispatch = useDispatch();
  const { registration } = useSelector(({ subscribe }) => ({
    registration: subscribe.registration
  }));

  const onRegister = async (userId, pwd) => {
    const res = await authApi.register(userId, pwd);
    console.log(res);
    onLogin(userId, pwd);
  };

  const onLogin = async (userId, pwd) => {
    if (!registration) {
      console.error("No Registration");
      return;
    }
    const oldSubscription = await registration.pushManager.getSubscription();
    console.log("Previous Subscription: ", oldSubscription);

    let subscription;

    // 이미 구독했다면
    if (oldSubscription) {
      console.log("Already Subscription Exists");
      subscription = oldSubscription;
    } else {
      console.log("No Subscription");
      const newSubscription = await subscribeLib.subscribe(registration);
      subscription = newSubscription;
      // subscribeLib.updateSubscriptionOnServer(newSubscription);
    }

    dispatch(login({ userId, pwd, subscription }));
  };

  return (
    <AccountForm
      onLogin={onLogin}
      onRegister={onRegister}
      closeAccountForm={closeAccountForm}
    />
  );
};

export default AccountContainer;
