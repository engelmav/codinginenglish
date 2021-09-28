import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { layout, position } from "styled-system";
import { H3 } from "../UtilComponents/Typography/Typography";
import { darkGray, darkGrayRgb } from "../UtilComponents/sharedStyles";
import { FaRegWindowClose } from "@react-icons/all-files/fa/FaRegWindowClose";

const ModalContainer = styled.div`
  color: white;
  overflow-x: hidden;
  flex-direction: column;
  box-shadow: 0px 0px 3px gray, 0 0 3px gray, 0px 0px 3px gray;
`;

ModalContainer.defaultProps = { mt: 4, mx: 3 };

const ModalHeader = styled.div`
  background-color: #ffff;

  display: flex;
  align-items: space-between;
  justify-content: space-between;
  border-bottom: 1px ${darkGray} solid;
`;
ModalHeader.defaultProps = {
  p: 3,
};

const Background = styled.div`
  position: absolute;
  z-index: 20;
  left: 0;
  top: 0;
  ${position}
  background: rgba(${darkGrayRgb}, 0.5);
  width: 100vw;
  height: 100%;
  min-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const CloseBox = styled(FaRegWindowClose)`
  color: ${darkGray};
`;

const ContentContainer = styled.div`
  ${layout}
  overflow-y: scroll;
`;

const Modal = ({
  backgroundStyles,
  children,
  contentContainerStyles,
  headerStyles,
  onClose,
  modalStyles,
  title,
}) => {
  const [yPos, setYPos] = useState(0);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    setYPos(window.scrollY);
    return () => (document.body.style.overflow = "unset");
  }, []);
  return (
    <Background top={yPos} {...backgroundStyles}>
      <ModalContainer
        display="flex"
        flexDirection="column"   
        {...modalStyles}
      >
        <ModalHeader {...headerStyles}>
          <h3 textAlign="center" mb={0} fontSize={[2]} color={darkGray}>
            {title}
          </h3>
          <CloseBox
            data-cy="close-modal-btn"
            size={25}
            onClick={onClose}
            ml="3"
          />
        </ModalHeader>
        <ContentContainer {...contentContainerStyles}>
          {children}
        </ContentContainer>
      </ModalContainer>
    </Background>
  );
};

export default Modal;
