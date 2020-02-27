import React, { Component } from 'react'
import axios from 'axios';
import { DateTime } from 'luxon';
import Modal from 'react-modal';
import { ElementsConsumer, Elements, CardElement } from '@stripe/react-stripe-js';
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
const stripePromise = loadStripe('pk_test_JJ1eMdKN0Hp4UFJ6kWXWO4ix00jtXzq5XG');

function CardSelection() {
  return (
    <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  )
};


class CheckoutForm extends Component {
  handleSubmit = async (event) => {
    // disable default form submission
    event.preventDefault();

    const { stripe, elements } = this.props;

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
    try {
      const clientSecret = await axios.post('/payment/create-payment-intent', intentParams);
    } catch {
      alert("Something went wrong! You have not been charged, and we are looking into the issue right now.");
      return;
    }
    const result = await stripe.confirmPayment('{CLIENT_SECRET}', paymentMethod);

    if (result.error) {
      // TODO: turn into modal
      alert(result.error.message);
    } else {
      // The payment was processed.
      if (result.paymentIntent.status === 'succeeeded') {
        // TOOD: turn into modal.
        alert("Class purchased successfully!");
      }
    }
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
          <Elements stripe={stripePromise}>
            <form>
              <CardSelection />
              <button disabled={!this.props.stripe}>Confirm</button>
            </form>
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

export { Welcome, ModuleCard };