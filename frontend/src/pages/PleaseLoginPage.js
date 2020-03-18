import React, { useState } from "react";
import LoginText from "components/LoginText";
import AccountContainer from "containers/AccountContainer";
import styled from "styled-components";

const BackgroundFocus = styled("div")`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  opacity: 0.5;
`;

const AccountModal = styled("div")`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const RootContainer = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PleaseLoginText = styled("div")`
  color: var(--gray);
  font-size: 4rem;
  font-weight: 600;
`;

const StyledLoginText = styled(LoginText)`
  margin-top: 3rem;
`;

const PleaseLoginPage = () => {
  const [showAccountModal, setShowAccountModal] = useState(false);

  return (
    <RootContainer>
      <PleaseLoginText>Please Login First!!</PleaseLoginText>
      <StyledLoginText
        setShowAccountModal={setShowAccountModal}
        isLogin={false}
      />
      {showAccountModal && (
        <>
          <BackgroundFocus />
          <AccountModal>
            <AccountContainer
              closeAccountForm={() => {
                setShowAccountModal(false);
              }}
            />
          </AccountModal>
        </>
      )}
    </RootContainer>
  );
};

export default PleaseLoginPage;
