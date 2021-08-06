import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  fontFamily,
  whenSmallScreen,
  cieOrange,
} from "../UtilComponents/sharedStyles";
import { Box } from "../UtilComponents";

const TimelineStyle = styled(Box)`

  width: 500px;
  .container {
    margin: auto;

  }

  li {
    margin-bottom: 25px;
  }

  .timeline {
    counter-reset: test 0;
    position: relative;
  }

  .timeline li {
    list-style: none;
    float: left;
    width: 25%;
    position: relative;
    text-align: center;
    text-transform: uppercase;
  }

  ul {
    padding: 0;
    /* font-family: ${fontFamily}; */
    font-family: "Roboto";
    font-weight: 700;
  }

  ul:nth-child(1) {
    ${whenSmallScreen`
      font-size: .8rem;`}
    color: black;
  }

  .timeline li:before {
  }

  .timeline li:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: grey;
    top: 25px;
    left: -50%;
    z-index: -999;
    transition: all ease-in-out 0.3s;
  }

  .timeline li:first-child:after {
    content: none;
  }
  .timeline li.active-tl {
    color: black;
  }
  .timeline li.active-tl:before {
    background: ${cieOrange};
    color: white;
  }
`;

const Milestone = styled.li`
  &:before {
    counter-increment: test;
    content: counter(test);
    display: block;
    text-align: center;
    line-height: 50px;
    margin: 0 auto 10px auto;
    color: #000;
    transition: all ease-in-out 0.3s;
    ${whenSmallScreen`
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-width: 1.5px;
    `}
    border-radius: 50%;
    width: 50px;
    height: 50px;
    border: 3px solid ${cieOrange};
    ${({ isActive }) => {
      if (isActive) {
        return `color: white; background: ${cieOrange}; };`;
      } else {
        return `color: black; background: white; };`;
      }
    }}
  }
`;

const Gradient = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  ${whenSmallScreen`
    display: initial;
    mask-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 15%,
        rgba(0, 0, 0, 1) 85%,
        rgba(0, 0, 0, 0) 100%
      );
      overflow-x: scroll;
  `}
`;

const milestones = ["Regístrate", "Solicitud", "Entrevista", "Matrícula"];

export const Timeline = ({ appStoreLazy }) => {
  const [appStore, setAppStore] = useState(null)
  useEffect(() => {
    async function init() {
      setAppStore(await appStoreLazy.load());
    }
    init();
  })
  
  return (
    <Gradient className="gradient-scroll">
      <TimelineStyle key={appStore?.milestone} pt={3} className="timeline-container">
        <ul className="timeline">
          {milestones.map((ms, idx) => {
            return (
              <Milestone key={idx} isActive={ms === appStore?.milestone}>
                {ms}
              </Milestone>
            );
          })}
        </ul>
      </TimelineStyle>
    </Gradient>
  );
};
