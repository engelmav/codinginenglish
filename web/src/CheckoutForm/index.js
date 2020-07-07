import {
  Elements, CardElement, useStripe, useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import axios from 'axios';
import settings from '../settings';

import {
  AlertMessage,
  Button,
  Spinner,
} from '../UtilComponents';

import { observable } from 'mobx';
import { observer } from 'mobx-react';
import 'mobx-react-lite/batchingForReactDom';
import { CcySelect, EmailNote, Form, PaymentInfo, PmtFormLabel, NameField, BuyButton } from './subcomponents';

const { stripePK } = settings;

let paymentCurrency = observable.box('EUR');
const setPaymentCurrency = (e) => paymentCurrency = e.target.value;


const stripePromise = loadStripe(stripePK);

const CurrencyMenu = () => {
  return (
    <CcySelect value={paymentCurrency} onChange={setPaymentCurrency}>
      {['EUR', 'USD'].map((currency, idx) => <option key={idx} value={currency}>{currency}</option>)}
    </CcySelect>
  )
};


function CheckoutFormConsumer(props) {
  const { appStore, onCloseClick, sessionData } = props;
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  // const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const computedEmail = email || appStore.email; // prioritize a manually entered email over the email we find in the auth user object.

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
          name,
          email,
        },
      }
    };

    const intentParams = {
      item: sessionData.id,
      currency: paymentCurrency,
      email: email
    };

    let clientSecret;
    try {
      setLoading(true);
      const resp = await axios.post('/api/payment/create-payment-intent', intentParams);
      clientSecret = resp.data.clientSecret;
    } catch (error) {
      setErrorMsg("We couldn't process your order. You have not been charged. We are looking into the issue right now.");
      setLoading(false);
      console.log(error);
      try {
        const failReason = { ...error, email: email };
        const resp = await axios.post('/api/payment/failure', failReason);
      } catch (err2) {
        console.log("Failed to capture fail reason. Epic!", err2)
      }
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, paymentMethod);

    if (result.error) {
      console.log(result);
      setErrorMsg(result.error.message);
      setLoading(false);
    } else {
      // The payment was processed.
      console.log(result);
      if (result.paymentIntent.status === 'succeeded') {
        // TODO: turn into modal.
        setComplete(true);
        setLoading(false);
      }
    }
  }
  return (
    <>
      {isComplete ?
        <>
          <p>Your purchase is complete. See you in there!</p>
          <Button onClick={onCloseClick}>CLOSE</Button>
        </>
        :
        <Form onSubmit={handleSubmit}>
          <PaymentInfo className="FormGroup">
            <PmtFormLabel>Name</PmtFormLabel>
            <NameField placeholder="You Name Here" value={name} onChange={e => setName(e.target.value)} />
            <PmtFormLabel>Card Details</PmtFormLabel><CardElement />
            {/* <PmtFormLabel>Postal/Zip Code</PmtFormLabel><NameField placeholder="08000" value={postalCode} onChange={e => setPostalCode(e.target.value)} /> */}
            <PmtFormLabel>Currency</PmtFormLabel>
            <CurrencyMenu />

            <PmtFormLabel>Email</PmtFormLabel>
            <div>
              <NameField placeholder="some.name@domain.com"
                value={computedEmail || ''} // need this empty string for React to "control" this input field
                onChange={e => setEmail(e.target.value)}
              />
              <EmailNote>For receipt and account creation on your terms. We will NOT spam you.</EmailNote>
            </div>

            <BuyButton onClick={handleSubmit} disabled={!stripe || isLoading}>
              PURCHASE
            </BuyButton>
          </PaymentInfo>
          {isLoading && <Spinner />}
          {(!isLoading && errorMsg) && <AlertMessage style={{ marginTop: '3px' }} text={errorMsg} />}
        </Form>}
    </>
  );
}


function CheckoutForm(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormConsumer appStore={props.appStore} onCloseClick={props.onCloseClick} sessionData={props.sessionData} />
    </Elements>
  )
}

const CheckoutFormObserver = observer(CheckoutForm);

export { CheckoutFormObserver as CheckoutForm };