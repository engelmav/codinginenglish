import axios from 'axios';
import 'mobx-react-lite/batchingForReactDom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { useState } from 'react';

import {
  Elements, CardElement, useStripe, useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import settings from '../settings';
import { cieApi } from '../services/cieApi';
import { AlertMessage, Button, Spinner } from '../UtilComponents';
import { CcySelect, EmailNote, Form, PaymentInfo, PmtFormLabel, NameField, BuyButton } from './subcomponents';


const { stripePK } = settings;
const stripePromise = loadStripe(stripePK);

let paymentCurrency = observable.box('EUR');
const setPaymentCurrency = (e) => paymentCurrency = e.target.value;
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
  const [email, setEmail] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInvalidEmail, setIsInvalidEmail] = useState('');

  const computedEmail = email || appStore.email; // prioritize a manually entered email over the email we find in the auth user object.

  const handleSubmit = async (event) => {
    // disable default form submission
    event.preventDefault();

    /**
     * Calls API backend to validate email. If email is invalid, returns true.
     * @param {string} email 
     */
    async function emailValidationFailure(email) {
      try {
        const res = await axios.put('/api/payment/validate-email', { email });
        const { errors } = res.data;
        const hasErrors = errors !== undefined && errors.length > 0;
        if (hasErrors) {
          setLoading(false);
          setErrorMsg(errors);
          return true;
        }
      } catch (error) {
        // the http call to the backend must have failed.
        setLoading(false);
        console.log("Error calling email validation on the backend:", error);
        setErrorMsg("An internal error ocurred. You might want to try again. The issue has been logged for investigation.");
        return true;
      }
      return false;
    }

    /** Creates payment intent and returns a client secret for use in the next step.
     *  If function fails, returns null.
     */
    async function createPaymentIntent(intentParams) {
      let clientSecret;
      try {
        const resp = await axios.post('/api/payment/create-payment-intent', intentParams);
        clientSecret = resp.data.clientSecret;
      } catch (error) {
        setErrorMsg("We couldn't process your order. You have not been charged. The issue has been logged for investigation.");
        setLoading(false);
        console.log(error);
        try {
          const failReason = { ...error, email: computedEmail };
          await axios.post('/api/payment/failure', failReason);
        } catch (err2) {
          console.log("Failed to capture reason for create-payment-intent failure. Epic!", err2)
        }
        return null;
      }
      return clientSecret;
    }

    function errorAndSetComplete(errorText) {
      setErrorMsg(errorText);
      setLoading(false);
      setComplete(true);
    }

    const noEmail = email === null || email === '';
    if (noEmail) {
      setIsInvalidEmail("Hey! We need your email address to send you a receipt and class information. Please enter one. :)")
    }

    const stripeNotLoaded = !stripe || !elements;
    if (stripeNotLoaded) {
      return;
    }

    setLoading(true);

    if (await emailValidationFailure(email)) {
      // if validation fails, exit early.
      setLoading(false);
      return;
    }

    const intentParams = {
      item: sessionData.id,
      currency: paymentCurrency,
      email: email
    };

    const clientSecret = await createPaymentIntent(intentParams);

    const paymentMethod = {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name,
          email,
        },
      }
    };

    const result = await stripe.confirmCardPayment(clientSecret, paymentMethod);
    if (result.error) {
      console.log(result);
      await axios.post('/api/payment/failure', result.error);
      setErrorMsg(result.error.message);
      setLoading(false);
    } else {
      // The payment was processed.
      console.log(result);
      const errorText = "Something went wrong when we tried to send your confirmation email, but your class was purchased successfully. We will reach out to you shortly.";
      let confirmationResp;
      if (result.paymentIntent.status === 'succeeded') {
        setComplete(true);
        setLoading(false);
        confirmationResp = cieApi.sendPaymentConfirmation({
          email: computedEmail,
          /**
           * intentionally stick with login user's name if different from card name (don't use a computedName),
           * this is in case the user uses a card that isn't their own.
           *  */ 
          name: name,
          moduleSessionId: sessionData.id,
          isAuthenticated: appStore.authData !== null,
          paymentResult: result
        }).catch(err => { console.log("Failed to send payment confirmation:", err); errorAndSetComplete(errorText); })
      }

    }
    if (confirmationResp === 'undefined' || confirmationResp.success === false) {
      errorAndSetComplete(errorText);
    }
  }


  return (
    <>
      {isComplete ?
        <>
          <p>Your purchase is complete! Check your email for further instructions. If you do not see the confirmation email, please check your spam folder. See you in class!</p>
          {errorMsg && <AlertMessage style={{ marginTop: '3px' }} text={errorMsg} />}
          <Button onClick={onCloseClick}>CLOSE</Button>
        </>
        :
        <Form onSubmit={handleSubmit}>
          <PaymentInfo className="FormGroup">
            <PmtFormLabel>Name</PmtFormLabel>
            <NameField placeholder="Your name here" value={name} onChange={e => setName(e.target.value)} />
            <PmtFormLabel>Card Details</PmtFormLabel><CardElement />
            {/* <PmtFormLabel>Postal/Zip Code</PmtFormLabel><NameField placeholder="08000" value={postalCode} onChange={e => setPostalCode(e.target.value)} /> */}
            <PmtFormLabel>Currency</PmtFormLabel>
            <CurrencyMenu />

            <PmtFormLabel>Email</PmtFormLabel>
            <div>
              <NameField placeholder="name@domain.com"
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