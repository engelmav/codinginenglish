import {
  Elements, CardElement, useStripe, useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';


import { Button } from '../UtilComponents/Button';
import { AlertMessage } from '../UtilComponents/AlertMessage';
import { Spinner } from '../UtilComponents/Spinner';
import { TextInput } from '../UtilComponents/TextInput';
import { font } from '../UtilComponents/sharedStyles';

import styles from './styles.css';

/* global window */
window.enablePayments = true;


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


const CustomerInfo = styled.div`
  ${font}
  display: grid;
  grid-template-columns: .25fr fit-content(600px);
  grid-gap: 0.3em;
  align-items: center;
  grid-auto-flow: dense;
`;
const NameField = styled(TextInput)`
  grid-column: 2 / 3;
  width: auto;
  margin: 0;
  border: none;
  outline: none;
`;
const PmtFormLabel = styled.label`
  text-align: right;
  width: auto;
  padding: 0;
  margin: 0;
  font-size: 85%;
`;
const BuyButton = styled(Button)`
  grid-column: 2 / 3;
  border-color: black;
  background-color: black;
  color: white;
  &:hover {
    color: black;
    background-color: white;
  }
  margin-top: 6px;
`;
const CurrencyMenu = () => {
  return (
    <select><option>EUR</option><option>USD</option></select>
  )
};


const Form = styled.form`

`;


function CheckoutFormConsumer(props) {
  const { onCloseClick } = props;
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
    let clientSecret;
    try {
      setLoading(true);
      const resp = await axios.post('/payment/create-payment-intent', intentParams);
      clientSecret = resp.data.clientSecret;
    } catch (error) {
      setErrorMsg("We couldn't process your order. You have not been charged. We are looking into the issue right now.");
      setLoading(false);
      console.log(error);
      // TODO: capture failure at backend
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
        // TOOD: turn into modal.
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
          <button onClick={onCloseClick}>CLOSE</button>
        </>
        :
        <Form onSubmit={handleSubmit}>
          <CustomerInfo className="FormGroup">
            <PmtFormLabel>Name</PmtFormLabel><NameField placeholder="Marcus Aurelius" />
            <PmtFormLabel>Card Number</PmtFormLabel><CardNumberElement />
            <PmtFormLabel>Expires</PmtFormLabel><CardExpiryElement />
            <PmtFormLabel>CVC</PmtFormLabel><CardCvcElement />
            <PmtFormLabel>Currency</PmtFormLabel><CurrencyMenu />
            <BuyButton onClick={handleSubmit} disabled={!stripe || isLoading}>
              PURCHASE
            </BuyButton>
          </CustomerInfo>
          {isLoading && <Spinner />}
          {(!isLoading && errorMsg) && <AlertMessage style={{ marginTop: '3px' }} text={errorMsg} />}
        </Form>}
    </>
  );
}


function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      {window.enablePayments ? <CheckoutFormConsumer /> : <div>payments disabled</div>}
    </Elements>
  )
}


export { CheckoutForm };