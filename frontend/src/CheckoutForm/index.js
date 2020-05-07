import {
  Elements, CardElement, useStripe, useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { 
  AlertMessage,
  Button,
  Spinner,
  TextInput,
 } from '../UtilComponents';

import { font } from '../UtilComponents/sharedStyles';


/* global window */
window.enablePayments = true;

const stripePromise = loadStripe('pk_test_cwKTnilflzQHY5WlR2x2tgwa00KGJyLRrP');

const PaymentInfo = styled.div`
  ${font}
  display: grid;
  grid-template-columns: min-content auto;
  grid-gap: 0.6em;
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
  align-self: start;
  text-align: right;
  width: auto;
  padding: 0;
  padding-top: 1px;
  margin: 0;
  font-size: 85%;
  font-weight: 600;
  white-space: nowrap;

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
  justify-self: start;
`;

const CcyMenu = styled.select`
  justify-self: start;
`;
const CurrencyMenu = () => {
  return (
    <CcyMenu><option>EUR</option><option>USD</option></CcyMenu>
  )
};


const Form = styled.form`

`;

const EmailNote = styled.p`
  font-style: italic;
  font-size: .8em;
  margin: 0;
  padding-top: 1px;
  padding-bottom: 1px;
`;


function CheckoutFormConsumer(props) {
  const { onCloseClick, appStore } = props;
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('');
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
      currency: currency
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
          <PaymentInfo className="FormGroup">
            <PmtFormLabel>Name</PmtFormLabel><NameField placeholder="Marcus Aurelius" value={name} onChange={e => setName(e.target.value)} />
            <PmtFormLabel>Card Details</PmtFormLabel><CardElement />
            <PmtFormLabel>Postal/Zip Code</PmtFormLabel><NameField placeholder="08000" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
            <PmtFormLabel>Currency</PmtFormLabel><CurrencyMenu />
            {!appStore.authData &&
              <>
                <PmtFormLabel>Email</PmtFormLabel>
                <div>
                  <NameField placeholder="marcus.aurelius@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
                  <EmailNote>For receipt and account creation on your terms. We will NOT spam you.</EmailNote>
                </div>
              </>
            }
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
      {window.enablePayments ? <CheckoutFormConsumer appStore={props.appStore} /> : <div>payments disabled</div>}
    </Elements>
  )
}


export { CheckoutForm };