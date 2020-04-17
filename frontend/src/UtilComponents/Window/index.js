import React from 'react';
import styled from 'styled-components';
import { FaGripLines } from 'react-icons/fa'

const TitleBar = styled.div`
  border: 1px solid black;
  padding-left: 4px;
  padding-top: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CloseBox = styled.div`
  padding: 1px;
`;

const Window = (props) => {
  const { windowName, children } = props;
  return (
    <div>
      <TitleBar>
        <FaGripLines />
        <div>{windowName}</div>
        <CloseBox>x</CloseBox>
      </TitleBar>
      {children}
    </div>
  );


};

export { Window };