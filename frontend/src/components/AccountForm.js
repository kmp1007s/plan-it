import React, { useState } from "react";
import { Form, FormInput, FormGroup, Button } from "shards-react";
import styled from "styled-components";

const RootContainer = styled("div")`
  width: 50%;
  height: 38%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  display: inline-flex;
  justify-content: center;
  position: relative;
`;

const StyledForm = styled(Form)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: var(${props => props.backgroundColor || "--white"});
`;

const SubmitButton = styled(Button)`
  align-self: flex-end;
  margin-top: 1.3rem;
`;

const StyledLabel = styled("label")`
  color: var(${props => props.color || "--black"});
`;

const Title = styled("h2")`
  color: var(${props => props.color || "--gray"});
  margin-bottom: 2rem;
`;

const CloseTrigger = styled("a")`
  display: inline-block;
  position: absolute;
  top: 0;
  left: 98%;
  color: var(--white);

  &:hover {
    color: var(--white);
    filter: brightness(1.2);
  }
`;

const AccountForm = ({ onLogin, onRegister, closeAccountForm }) => {
  const [loginUserId, setLoginUserId] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [registerUserId, setRegisterUserId] = useState("");
  const [registerPwd, setRegisterPwd] = useState("");

  return (
    <RootContainer>
      <StyledForm>
        <Title>Log In</Title>
        <FormGroup>
          <StyledLabel htmlFor="loginUserId">UserID</StyledLabel>
          <FormInput
            id="loginUserId"
            placeholder="UserID"
            onChange={e => {
              setLoginUserId(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <StyledLabel htmlFor="loginPwd">Password</StyledLabel>
          <FormInput
            id="loginPwd"
            placeholder="Password"
            type="password"
            onChange={e => {
              setLoginPwd(e.target.value);
            }}
            autoComplete="on"
          />
        </FormGroup>
        <SubmitButton
          theme="primary"
          onClick={() => {
            closeAccountForm();
            onLogin(loginUserId, loginPwd);
          }}
        >
          LOGIN
        </SubmitButton>
      </StyledForm>
      <StyledForm backgroundColor="--primary">
        <Title color="--light">Register In</Title>
        <FormGroup>
          <StyledLabel htmlFor="registerUserId" color="--white">
            UserID
          </StyledLabel>
          <FormInput
            id="registerUserId"
            placeholder="UserID"
            onChange={e => {
              setRegisterUserId(e.target.value);
            }}
          />
        </FormGroup>
        <FormGroup>
          <StyledLabel htmlFor="registerPwd" color="--white">
            Password
          </StyledLabel>
          <FormInput
            id="registerPwd"
            placeholder="Password"
            type="password"
            onChange={e => {
              setRegisterPwd(e.target.value);
            }}
            autoComplete="on"
          />
        </FormGroup>
        <SubmitButton
          theme="white"
          onClick={() => {
            onRegister(registerUserId, registerPwd);
          }}
        >
          REGISTER
        </SubmitButton>
      </StyledForm>
      <CloseTrigger
        href="#"
        onClick={e => {
          e.preventDefault();
          closeAccountForm();
        }}
      >
        X
      </CloseTrigger>
    </RootContainer>
  );
};

export default AccountForm;
