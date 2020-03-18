import React, { useEffect, useState } from "react";
import dateLib from "lib/date";
import { useDispatch } from "react-redux";
import { getSchedules, createSchedule } from "modules/schedule";
import styled from "styled-components";
import ScheduleContainer from "containers/ScheduleContainer";
import LoginText from "components/LoginText";
import { Button, Container, Row, Col, FormInput } from "shards-react";

const BtnContainer = styled("div")`
  display: flex;
  justify-content: center;
  clear: right;
`;

const StyledLoginBtn = styled(LoginText)`
  margin: 1rem;
  filter: brightness(1.3);
`;

const StyledBtn = styled(Button)`
  margin: 1rem;
  filter: brightness(1.3);
`;

const NoPadingCol = styled(Col)`
  padding: 0;
`;

const SquaredInput = styled(FormInput)`
  border-radius: 0;
`;

const StyledSchedule = styled(ScheduleContainer)`
  margin-top: 3rem;
`;

const UserIdBlock = styled("div")`
  padding-top: 0.2rem;
  padding-right: 0.2rem;
  position: relative;
  display: inline-block;
  float: right;
  font-size: 1.1rem;
  font-weight: 600;
`;

const UserIdTxt = styled("span")`
  text-decoration: underline;
  color: var(--blue);
  filter: brightness(1.3);
`;

const MainPage = ({ userId }) => {
  const dispatch = useDispatch();

  const [dateInput, setDateInput] = useState("");
  const [timeToStartInput, setTimeToStartInput] = useState("");
  const [timeToEndInput, setTimeToEndInput] = useState("");
  const [yourPlanInput, setYourPlanInput] = useState("");

  useEffect(() => {
    dispatch(getSchedules());
  }, [dispatch]);

  return (
    <>
      <UserIdBlock>
        Welcome <UserIdTxt>{userId}!</UserIdTxt>
      </UserIdBlock>
      <BtnContainer>
        <StyledBtn
          onClick={() => {
            dispatch(getSchedules());
          }}
          squared
        >
          Refresh
        </StyledBtn>
        <StyledLoginBtn isLogin={true} />
        <StyledBtn
          squared
          onClick={async () => {
            const startTimeSplit = timeToStartInput.split(":");
            const finishTimeSplit = timeToEndInput.split(":");
            const dateSplit = dateInput.split("/");

            const startTime = dateLib.makeTimeFormat(
              startTimeSplit[0],
              startTimeSplit[1]
            );
            const finishTime = dateLib.makeTimeFormat(
              finishTimeSplit[0],
              finishTimeSplit[1]
            );
            const date = dateLib.makeDateFormat(
              dateSplit[0],
              dateSplit[1],
              dateSplit[2]
            );
            const schedule = yourPlanInput;

            dispatch(createSchedule({ date, startTime, finishTime, schedule }));

            setDateInput("");
            setTimeToStartInput("");
            setTimeToEndInput("");
            setYourPlanInput("");
          }}
        >
          Add
        </StyledBtn>
      </BtnContainer>
      <StyledSchedule />
      <Container>
        <Row>
          <NoPadingCol lg="3">
            <SquaredInput
              placeholder="yyyy/mm/dd (Date)"
              onChange={e => {
                setDateInput(e.target.value);
              }}
              value={dateInput}
            />
          </NoPadingCol>
          <NoPadingCol lg="3">
            <SquaredInput
              placeholder="hh:mm (Time To Start)"
              onChange={e => {
                setTimeToStartInput(e.target.value);
              }}
              value={timeToStartInput}
            />
          </NoPadingCol>
          <NoPadingCol lg="3">
            <SquaredInput
              placeholder="hh:mm (Time To End)"
              onChange={e => {
                setTimeToEndInput(e.target.value);
              }}
              value={timeToEndInput}
            />
          </NoPadingCol>
          <NoPadingCol lg="3">
            <SquaredInput
              placeholder="Your Plan"
              onChange={e => {
                setYourPlanInput(e.target.value);
              }}
              value={yourPlanInput}
            />
          </NoPadingCol>
        </Row>
      </Container>
    </>
  );
};

export default MainPage;
