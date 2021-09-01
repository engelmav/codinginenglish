import React from "react";
import styled from "styled-components";
import { Box, boxy } from "../UtilComponents";
import { P, H3 } from "../UtilComponents/Typography/Typography";
import { darkGrayRgb } from "../UtilComponents/sharedStyles";
import { FaRegWindowClose } from "@react-icons/all-files/fa/FaRegWindowClose";
import { flexbox } from "styled-system";

const ModalStyle = styled.div`
  ${boxy}
  color: white;
  overflow-x: hidden;
  flex-direction: column;
  background: rgba(${darkGrayRgb}, 1);
  box-shadow: 0px 0px 3px gray, 0 0 3px gray, 0px 0px 3px gray;
  ${flexbox}
`;

ModalStyle.defaultProps = { mt: 4, mx: 3 };

const ModalHeader = styled.div`
  ${boxy}
  display: flex;
  align-items: space-between;
  justify-content: space-between;
  border-bottom: 1px gray solid;
`;
ModalHeader.defaultProps = {
  p: 3,
};

const Background = styled.div`
  position: fixed;
  z-index: 20;
  left: 0;
  top: 0;
  background: rgba(${darkGrayRgb}, 0.5);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const CloseBox = styled(FaRegWindowClose)`
${boxy}
`


const Modal = ({ children, onClose, styleProps, title }) => {
  return (
    <Background>
      <ModalStyle
        display="flex"
        flexDirection="column"
        mt={[6]}
        {...styleProps}
      >
        <ModalHeader>
          <H3 mb={0} fontSize={[2]} color="white">
            {title}
          </H3>

          <CloseBox
            data-cy="close-modal-btn"
            size={25}
            onClick={onClose}
            ml="3"
          />
        </ModalHeader>
        {children}
      </ModalStyle>
    </Background>
  );
};

export default Modal;
