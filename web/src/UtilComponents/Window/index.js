import React from "react";
import styled from "styled-components";
import { font } from "../sharedStyles";
import { FaGripLines, FaRegWindowClose } from "react-icons/fa";

const TitleBar = styled.div`
  ${font}
  border: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 2px;
`;

const Window = (props) => {
  const { title, onClose, hideClose } = props;
  return (
    <TitleBar>
      <FaGripLines style={{ marginLeft: "6px" }} />
      <div>{title}</div>
      {!hideClose ? (
        <FaRegWindowClose
          style={{ marginRight: "3px", cursor: "pointer" }}
          onClick={onClose}
        />
      ) : (
        <div></div>
      )}
    </TitleBar>
  );
};

export { Window };
