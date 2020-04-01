import React, { Component } from 'react'
import axios from 'axios';
import { DateTime } from 'luxon';
import Modal from 'react-modal';

import { CheckoutForm } from '../CheckoutForm';
import { Button } from '../UtilComponents/Button';

import './styles.css';


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


class Welcome extends Component {
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
    return (
      <main>
        <div className="modules-grid">
          {
            classList.map((sessionData, i) =>
              <ModuleCard key={i} sessionData={sessionData} />)
          }
        </div>
      </main>
    );
  }
}


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
    var local = DateTime.fromISO(session_datetime);
    const localDateTime = local.toLocaleString(DateTime.DATETIME_FULL);
    const { modalIsOpen } = this.state;
    const { afterOpenModal, closeModal } = this;
    return (
      <div className="module-card">
        <img src={cie_module.image_path} alt={cie_module.name} />
        <h1>{cie_module.name}</h1>
        <p className="datetime">Starts {localDateTime}</p>
        <Button 
          onClick={this.handleSignupClick}
          justifySelf='end'
          m={2}>
            REGISTER
        </Button>
        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}>
          <h1>{cie_module.name}</h1>
          <p>Starts {localDateTime}</p>
          <p>{cie_module.description}</p>
            <CheckoutForm onCloseClick={closeModal} />
        </Modal>
      </div>
    );
  }
}


export { Welcome, ModuleCard };