import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "modules/auth.js";
import { Button } from "shards-react";

const LoginText = ({ setShowAccountModal, isLogin, className }) => {
  const dispatch = useDispatch();

  return (
    <div className={className}>
      {isLogin ? (
        <Button
          onClick={e => {
            dispatch(logout());
          }}
          squared
        >
          Logout
        </Button>
      ) : (
        <Button
          onClick={e => {
            setShowAccountModal(true);
          }}
          size="lg"
          squared
        >
          LOGIN/REGISTER
        </Button>
      )}
    </div>
  );
};

export default LoginText;
