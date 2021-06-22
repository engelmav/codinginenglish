import React from "react";
import styled from "styled-components";
import { font } from "../sharedStyles";
import { FaRegWindowClose } from "@react-icons/all-files/fa/FaRegWindowClose";
import { FaGripLines } from "@react-icons/all-files/fa/FaGripLines";


const TitleBar = styled.div`
  ${font}
  border: 1px solid black;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 2px;
`;

const WindowTitle = styled.div`
  font-weight: bold;
`

const Window = (props) => {
  const { title, onClose, hideClose } = props;
  return (
    <TitleBar className="drag-handle" style={{position: "sticky"}}>
      <FaGripLines style={{ marginLeft: "10px" }} />
      <WindowTitle>{title}</WindowTitle>
      {!hideClose ? (
        <FaRegWindowClose
          size={25}
          style={{ marginRight: "10px", cursor: "pointer" }}
          onClick={onClose}
        />
      ) : (
        <div></div>
      )}
    </TitleBar>
  );
};

export { Window };
