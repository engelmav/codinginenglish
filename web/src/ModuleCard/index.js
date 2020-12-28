import { DateTime } from 'luxon';
import Modal from 'react-modal';

// import { CheckoutForm } from '../CheckoutForm';
import { Button, ContentSection, Title } from '../UtilComponents';
import { FaRegWindowClose } from 'react-icons/fa';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import React, { Component } from 'react';

const ModuleCardContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ff3e00;
  &:last-of-type {
    border-bottom: none;
  }
  border-radius: 3px;
  background-color: white;
  font-family: 'Roboto', serif;
  padding-bottom: 30px;
  margin-bottom: 30px;


  h1 {
    font-size: 120%;
    // justify-self: center;
    font-weight: 850;
  }

  .datetime {
    font-size: 80%;
    justify-self: center;
  }
  .title-desc {
    padding-left: 30px;
  }
`;


const ModalContent = styled.div`
  margin: 0 auto;
  width: 80%
`;


@observer
class ModuleCard extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };
  }

  handleSignupClick = () => {
    this.setState({ modalIsOpen: true });
    this.props.cieApi.startSignup(this.props.sessionData.id, 1);
  }

  afterOpenModal = () => {
    // ?
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { appStore, sessionData, settings, CheckoutForm } = this.props;
    let { cie_module, session_datetime } = sessionData;
    var sessionDateTime = DateTime.fromISO(session_datetime);
    const localSessionDateTime = sessionDateTime.toLocaleString(DateTime.DATETIME_FULL);
    const { modalIsOpen } = this.state;
    const { afterOpenModal, closeModal } = this;

        // <div className="title-desc">
        //   <Title p={0}>{cie_module.name}</Title>
        //   <p className="datetime">Course begins {localSessionDateTime}</p>
        //   <p>{cie_module.description}</p>
        //   <Button
        //     onClick={this.handleSignupClick}
        //     m={2}>
        //     REGISTER
        // </Button>
        // </div>
        // <Modal
        //   style={{
        //     content: { top: '45%', left: '50%', transform: 'translate(-50%,-50%)', width: '45%' }
        //   }}
        //   ariaHideApp={false}
        //   isOpen={modalIsOpen}
        //   onAfterOpen={afterOpenModal}
        //   onRequestClose={closeModal}
        //   shouldCloseOnOverlayClick={false}
        // >
        //   <FaRegWindowClose size="20" style={{ cursor: "pointer", float: 'right' }}
        //     onClick={closeModal}
        //   />
        //   <ModalContent>
        //     <Title>{cie_module.name}</Title>
        //     <ContentSection>
        //       <p>Starts {localSessionDateTime}</p>
        //       {appStore.authData == null &&
        //         <>
        //           <p>Already registered as a student? Sign in!</p>
        //           <p>Otherwise, register for this class as a guest. You can create a student profile later.</p>
        //         </>
        //       }
        //     </ContentSection>
        //     <CheckoutForm sessionData={sessionData} onCloseClick={closeModal} appStore={appStore} />
        //   </ModalContent>
        // </Modal>
    return (
      <ModuleCardContainer>
                <img src={
          `${settings.assets}/lego-man-key-250.jpeg`
         }
                    alt={cie_module.name}
           width="150"
           height="150"
         />
                <div className="title-desc">
          <Title p={0}>{cie_module.name}</Title>
          <p className="datetime">Course begins {localSessionDateTime}</p>
          <p>{cie_module.description}</p>
          <Button
            onClick={this.handleSignupClick}
            m={2}>
            REGISTER
        </Button>
        </div>
        <Modal
          style={{
            content: { top: '45%', left: '50%', transform: 'translate(-50%,-50%)', width: '45%' }
          }}
          ariaHideApp={false}
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick={false}
        >
          <FaRegWindowClose size="20" style={{ cursor: "pointer", float: 'right' }}
            onClick={closeModal}
          />
          <ModalContent>
            <Title>{cie_module.name}</Title>
            <ContentSection>
              <p>Starts {localSessionDateTime}</p>
              {appStore.authData == null &&
                <>
                  <p>Already registered as a student? Sign in!</p>
                  <p>Otherwise, register for this class as a guest. You can create a student profile later.</p>
                </>
              }
            </ContentSection>
            <CheckoutForm sessionData={sessionData} onCloseClick={closeModal} appStore={appStore} />
          </ModalContent>
        </Modal>
      </ModuleCardContainer>
    )
  }
}

export { ModuleCard };