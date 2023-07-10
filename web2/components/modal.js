import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Button } from "./forms";
import { CloseIcon } from "./svgIcons";

const ModalContainer = styled.div`
  position: absolute;
  z-index: 20;
  left: 0;
  top: ${(props) => `${props.yPos}px`};
  height: 100vh;
  width: 100%;
  background: white;
  overflow: scroll;
`;

const ModalHeader = styled.div`
  background: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
`;
const ModalTitle = styled.h1`
  color: #ffffff;
`;

export function Modal(props) {
  const { children, title, onClose } = props;
  const [yPos, setYPos] = useState(0);
  useEffect(() => {
    console.log("modal mounted");
    document.body.style.overflow = "hidden";
    setYPos(window.scrollY);
    return () => (document.body.style.overflow = "unset");
  }, []);
  return (
    <ModalContainer yPos={yPos}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <CloseIcon style={{cursor: "pointer"}} onClick={() => onClose()}>
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </CloseIcon>
      </ModalHeader>
      {children}
      <div style={{marginBottom: "2em", display: "flex", width: "100%", justifyContent: "center"}}><Button onClick={() => onClose()}>Close</Button></div>
    </ModalContainer>
  );
}
