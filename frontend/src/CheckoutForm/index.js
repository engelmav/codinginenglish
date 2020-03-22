import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { MetroSpinner } from 'react-spinners-kit';
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';


import { Button } from '../UtilComponents/Button';
import { AlertMessage } from '../UtilComponents/AlertMessage';

import styles from './styles.css';


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


const BuyButton = styled(Button)`
  border-color: black;
  background-color: black;
  color: white;
  &:hover {
    color: black;
    background-color: white;
  }
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
          <form onSubmit={handleSubmit}>
            <CardSection />
            <BuyButton onClick={handleSubmit} disabled={!stripe || isLoading}>
              {isLoading ?
                <MetroSpinner loading={true} size={15} color="#ff3e00" /> :
                "PURCHASE"}
            </BuyButton>
            {errorMsg && <AlertMessage style={{ marginTop: '3px' }} text={errorMsg} />}
          </form>}
    </>
  );
}


function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormConsumer />
    </Elements>
  )
}


export { CheckoutForm };