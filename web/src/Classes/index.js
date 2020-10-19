import React, { Component } from 'react'
import axios from 'axios';
import { DateTime } from 'luxon';
import Modal from 'react-modal';

import { CheckoutForm } from '../CheckoutForm';
import { Button, ContentSection, Main, Title } from '../UtilComponents';
import { FaRegWindowClose } from 'react-icons/fa';
import styled from 'styled-components';
import { observer } from 'mobx-react';


import './styles.css';
import settings from '../settings';


/* global __VERSION__ */


class CieApi {
  startSignup(name) {
    // TODO: add logged out flow
    console.log("Signing up to class", name);
    // Assume logged in.
  }
  async scheduledSessions() {
    let scheduledSessions = [];
    try {
      const res = await axios.get('/api/module-sessions');
      scheduledSessions = res.data;
    } catch {
      console.log("Failed to get classes.");
    }
    return scheduledSessions;
  }
}


var cieApi = new CieApi();



@observer
class Classes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: []
    };
    console.log(`Version ${__VERSION__}`);
  }

  async componentDidMount() {
    let classList;
    try {
      classList = await cieApi.scheduledSessions();
    } catch {
      console.log("Failed to assign class list.");
      classList = [];
    }
    this.setState({ classList });
  }

  render() {
    let { classList } = this.state;
    const { appStore } = this.props;
    return (
      <Main>
        <Title textAlign="center">upcoming classes</Title>
        <div>
          {
            classList.map((sessionData, i) =>
              <ModuleCard key={i} sessionData={sessionData} appStore={appStore} />)
          }
        </div>
      </Main>
    );
  }
}

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
    cieApi.startSignup(this.props.sessionData.id, 1);
  }

  afterOpenModal = () => {
    // ?
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    let { cie_module, session_datetime } = this.props.sessionData;
    var sessionDateTime = DateTime.fromISO(session_datetime);
    const localSessionDateTime = sessionDateTime.toLocaleString(DateTime.DATETIME_FULL);
    const { modalIsOpen } = this.state;
    const { afterOpenModal, closeModal } = this;
    const { appStore, sessionData } = this.props;
    return (
      <ModuleCardContainer>
        <img src={
          // cie_module.image_path
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
    );
  }
}


export { Classes, ModuleCard };