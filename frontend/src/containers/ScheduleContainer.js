import React from "react";
import Schedule from "components/Schedule";
import { useSelector } from "react-redux";
import { GET_SCHEDULES } from "modules/schedule";
import { Container, Row, Col } from "shards-react";
import styled from "styled-components";
import ReactLoading from "react-loading";

const StyledCol = styled(Col)`
  padding: 1rem;
  color: var(--gray);
  font-weight: 600;
`;

const NoPaddingCol = styled(Col)`
  padding: 0;
`;

const StyledLoading = styled(ReactLoading)`
  filter: brightness(1.3);
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const RootContainer = styled("div")`
  width: 100%;
  height: auto;
  position: relative;
  top: 0;
  left: 0;
`;

const ScheduleContainer = ({ className }) => {
  const { schedules, loadingSchedules } = useSelector(
    ({ schedule, loading }) => ({
      schedules: schedule.schedules,
      loadingSchedules: loading[GET_SCHEDULES]
    })
  );

  return (
    <RootContainer className={className}>
      {(loadingSchedules && (
        <StyledLoading type="spin" color="var(--blue)" />
      )) ||
        (schedules.length !== 0 && (
          <Container>
            <Row>
              <StyledCol lg="3">Date</StyledCol>
              <StyledCol lg="3">Time To Start</StyledCol>
              <StyledCol lg="3">Time To End</StyledCol>
              <StyledCol lg="3">Your Plan</StyledCol>
            </Row>
            {schedules.map(schedule => (
              <Row key={schedule._id}>
                <NoPaddingCol lg="12">
                  <Schedule
                    schedule={schedule.schedule}
                    startTime={schedule.startTime}
                    finishTime={schedule.finishTime}
                    date={schedule.date}
                  />
                </NoPaddingCol>
              </Row>
            ))}
          </Container>
        ))}
    </RootContainer>
  );
};

export default ScheduleContainer;
