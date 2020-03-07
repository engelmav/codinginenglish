import React, { Component, useState } from 'react'
import axios from 'axios';
import { DateTime } from 'luxon';
import Modal from 'react-modal';
import { ElementsConsumer, Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MetroSpinner } from 'react-spinners-kit';

import { AlertMessage } from '../UtilComponents/AlertMessage';

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

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    }
  }
};
const stripePromise = loadStripe('pk_test_cwKTnilflzQHY5WlR2x2tgwa00KGJyLRrP');

function CardSection() {
  return (
    <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  )
};

function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const handleSubmit = async (event) => {
    // disable default form submission
    event.preventDefault();

    if (!stripe || !elements) {
      // stripe isn't loaded yet
      return;
    }
    const paymentMethod = {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          // TODO: change to field inputs
          name: 'Jenny Rosen'
        },
      }
    }
    const intentParams = {
      // TODO: CIE class passed back here, lookup to be performed on backend.
      item: 1,
      // TODO: Where do I get this from?
      currency: 'EUR'
    }
    // TODO: disable form while confirmPayment() is in progress (show spinner).
    let clientSecret;
    try {
      setLoading(true);
      const resp = await axios.post('/payment/create-payment-intent', intentParams);
      clientSecret = resp.data.clientSecret;
      console.log(resp.data)
    } catch (error) {
      alert("We couldn't process your order. You have not been charged. We are looking into the issue right now.");
      console.log("Error attempting to process credit card payment:");
      setLoading(false);
      return;
    }
    const result = await stripe.confirmCardPayment(clientSecret, paymentMethod);

    if (result.error) {
      console.log(result);
      setErrorMsg(result.error.message);
    } else {
      // The payment was processed.
      console.log(result);
      if (result.paymentIntent.status === 'succeeded') {
        // TOOD: turn into modal.
        setComplete(true);
      }
    }
  }
  return (
    <>
      {isComplete ?
        <p>Your purchase is complete. See you in there!</p> :
        <form onSubmit={handleSubmit}>
          <CardSection />
          <button onClick={handleSubmit} disabled={!stripe || isLoading}>
            {isLoading ?
              <MetroSpinner loading={true} size={15} color="#ff3e00" /> :
              "PURCHASE"}
          </button>{errorMsg && <AlertMessage text={errorMsg} />}
        </form>}
    </>
  );
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
        <img src={cie_module.image_path} />
        <h1>{cie_module.name}</h1>
        <p className="datetime">Starts {localDateTime}</p>
        <button onClick={this.handleSignupClick}>SIGN UP</button>
        <Modal
          ariaHideApp={false}
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}>
          <h1>{cie_module.name}</h1>
          <p>Starts {localDateTime}</p>
          <p>{cie_module.description}</p>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </Modal>
      </div>
    );
  }
}

function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) =>
        <CheckoutForm stripe={stripe} elements={elements} />
      }
    </ElementsConsumer>
  )
}

export { Welcome, ModuleCard, CheckoutForm };