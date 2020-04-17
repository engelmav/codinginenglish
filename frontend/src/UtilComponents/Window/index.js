import React from 'react';
import styled from 'styled-components';
import { FaGripLines, FaRegWindowClose } from 'react-icons/fa'

const TitleBar = styled.div`
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CloseBox = styled.div`
  margin: 6px;
`;

const Window = (props) => {
  const { title, onClose } = props;
  return (
      <TitleBar>
        <FaGripLines style={{marginLeft: "6px"}}/>
        <div>{title}</div>
        <FaRegWindowClose style={{marginRight: "3px", cursor: "pointer"}}
          onClick={onClose}
        />
      </TitleBar>
  );
};

export { Window };