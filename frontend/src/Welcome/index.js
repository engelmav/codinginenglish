import React, { Component } from 'react'
import axios from 'axios';
import { DateTime } from 'luxon';
import Modal from 'react-modal';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import './styles.css';

class CieApi {
  startSignup(name) {
    // TODO: add logged out flow
    // TODO: credit card.
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
  constructor(){
    super();
    this.state = {
      modalIsOpen: false
    };
    this.stripePromise = loadStripe('pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG');

  }
  handleSignupClick = () => {
    this.setState({modalIsOpen: true});
    cieApi.startSignup(this.props.sessionData.id, 1);
  }
  afterOpenModal= () => {
    // ?
  }
  closeModal = () => {
    this.setState({modalIsOpen: false});
  }
  render() {
    let { cie_module, session_datetime } = this.props.sessionData;
    console.log("UTC from server:", session_datetime);
    var local = DateTime.fromISO(session_datetime);
    const localDateTime = local.toLocaleString(DateTime.DATETIME_FULL);
    const { modalIsOpen } = this.state;
    const { afterOpenModal, closeModal } = this;
    return (
      <div className="module-card">
        <img src={cie_module.image_path} />
        <h1>{cie_module.name}</h1>
        <p className="datetime">Starts {localDateTime}</p>
        <button onClick={this.handleSignupClick}>SIGN UP</button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}>
            <h1>Do they speak English in What?</h1>
            <Elements stripe={this.stripePromise}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid : {
                      color: '#9e2146',
                    }
                  }
                }}
              />
            </Elements>
        </Modal>
      </div>
    );
  }
}

export { Welcome, ModuleCard };