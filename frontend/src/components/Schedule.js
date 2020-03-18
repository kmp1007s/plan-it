import React from "react";
import styled from "styled-components";
import { Container, Row, Col } from "shards-react";

const StyledCol = styled(Col)`
  animation: slideFromRight 1s ease;
  padding-left: 0;
  padding-right: 0;
  padding: 1rem;
  background-color: var(--light);
  color: var(--black);

  &:nth-child(even) {
    background-color: var(--gray);
    color: var(--light);
    filter: brightness(1.3);
    animation: slideFromRight 1.5s ease;
  }

  @keyframes slideFromRight {
    from {
      opacity: 0;
      left: 1rem;
    }
    to {
      opacity: 1;
      left: 0;
    }
  }
`;

const Schedule = ({ schedule, startTime, finishTime, date }) => {
  return (
    <Container>
      <Row>
        <StyledCol lg="3">{date}</StyledCol>
        <StyledCol lg="3">{startTime}</StyledCol>
        <StyledCol lg="3">{finishTime}</StyledCol>
        <StyledCol lg="3">{schedule}</StyledCol>
      </Row>
    </Container>
  );
};

export default Schedule;
