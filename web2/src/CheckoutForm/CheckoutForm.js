import axios from "axios";
import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  smMediaQuery,
  smInputFontSize,
  lgInputFontSize,
  fontFamily,
  inputPadding,
  debugBorder,
} from "../UtilComponents/sharedStyles";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { cieApi } from "../services/cieApi";
import { AlertMessage, Button, Spinner } from "../UtilComponents";
import {
  CcySelect,
  EmailNote,
  Form,
  PaymentInfo,
  PmtFormLabel,
  PaymentInfoField,
  BuyButton,
} from "./subcomponents";
import {
  inputFormBorder,
  inputFormBorderRadius,
} from "../UtilComponents/TextInput";
const useMediaQuery = React.lazy(() => import("@material-ui/core/useMediaQuery"));


let stripePromise;
const getStripe = (settings) => {
  if (!stripePromise) {
    const { stripePK } = settings;
    stripePromise = loadStripe(stripePK);
  }
  return stripePromise;
};

let paymentCurrency = observable.box("EUR");
const setPaymentCurrency = (e) => (paymentCurrency = e.target.value);
const CurrencyMenu = () => {
  return (
    <CcySelect value={paymentCurrency} onChange={setPaymentCurrency}>
      {["EUR", "USD"].map((currency, idx) => (
        <option key={idx} value={currency}>
          {currency}
        </option>
      ))}
    </CcySelect>
  );
};

const CardElementContainer = styled.div`
  border: ${inputFormBorder};
  padding: ${inputPadding};
  padding-bottom: calc(${inputPadding} - 2px);
  border-radius: ${inputFormBorderRadius};
  width: 100%;
`;

const PaymentFormContainer = styled.div`
  max-width: 600px;
  display: flex;
  flex-wrap: wrap;
  ${debugBorder}
`;

function CheckoutFormConsumer(props) {
  const { appStore, onCloseClick, sessionData } = props;
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState("");
  const [computedEmail, setComputedEmail] = useState(null);

  useEffect(() => {
    const _computedEmail = email || appStore.email;
    setComputedEmail(_computedEmail);
  }, [email]);

  async function handlePurchaseProcess(event) {
    // prioritize a manually entered email over the email we find in the auth user object.

    // disable default form submission
    event.preventDefault();

    /**
     * Calls API backend to validate email. If email is invalid, returns true.
     * @param {string} email
     */
    async function emailValidationFailure(email) {
      try {
        const res = await axios.put("/api/payment/validate-email", { email });
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
        setErrorMsg(
          "An internal error ocurred. You might want to try again. The issue has been logged for investigation."
        );
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
        const resp = await axios.post(
          "/api/payment/create-payment-intent",
          intentParams
        );
        clientSecret = resp.data.clientSecret;
      } catch (error) {
        setErrorMsg(
          "We couldn't process your order. You have not been charged. The issue has been logged for investigation."
        );
        setLoading(false);
        console.log(error);
        try {
          const failReason = { ...error, email: computedEmail };
          await axios.post("/api/payment/failure", failReason);
        } catch (err2) {
          console.log(
            "Failed to capture reason for create-payment-intent failure. Epic!",
            err2
          );
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

    const noEmail = computedEmail === null || computedEmail === "";
    if (noEmail) {
      setIsInvalidEmail(
        "Hey! We need your email address to send you a receipt and class information. Please enter one. :)"
      );
    }
    const stripeNotLoaded = !stripe || !elements;
    if (stripeNotLoaded) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (await emailValidationFailure(computedEmail)) {
      // if validation fails, exit early.
      setLoading(false);
      return;
    }

    const intentParams = {
      item: sessionData.id,
      currency: paymentCurrency,
      email: email,
    };

    const clientSecret = await createPaymentIntent(intentParams);

    const paymentMethod = {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name,
          email,
        },
      },
    };

    let confirmationResp;
    const confirmationFailure =
      "Something went wrong when we tried to send your confirmation email, but your class was purchased successfully. We will reach out to you shortly.";
    const result = await stripe.confirmCardPayment(clientSecret, paymentMethod);
    if (result.error) {
      console.log(result);
      await axios.post("/api/payment/failure", result.error);
      setErrorMsg(result.error.message);
      setLoading(false);
    } else {
      // The payment was processed.
      if (result.paymentIntent.status === "succeeded") {
        setComplete(true);
        setLoading(false);
        confirmationResp = cieApi
          .sendPaymentConfirmation({
            email: computedEmail,
            /**
             * intentionally stick with login user's name if different from card name (don't use a computedName),
             * this is in case the user uses a card that isn't their own.
             **/
            name: name,
            moduleSessionId: sessionData.id,
            isAuthenticated: appStore.authData !== null,
            paymentResult: result,
          })
          .catch((err) => {
            console.log("Failed to send payment confirmation:", err);
            errorAndSetComplete(confirmationFailure);
          });
      }
    }
    if (
      confirmationResp === "undefined" ||
      confirmationResp.success === false
    ) {
      errorAndSetComplete(confirmationFailure);
    }
  }

  const isSmallScreen = useMediaQuery(smMediaQuery);
  return (
    <PaymentFormContainer>
      {isComplete ? (
        <>
          <p>
            Your purchase is complete! Check your email for further
            instructions. If you do not see the confirmation email, please check
            your spam folder. See you in class!
          </p>
          {errorMsg && (
            <AlertMessage style={{ marginTop: "3px" }} text={errorMsg} />
          )}
          <Button onClick={onCloseClick}>CLOSE</Button>
        </>
      ) : (
        <>
          <PaymentInfoField
            pb={10}
            placeholder="Your name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <PaymentInfoField
            placeholder="name@domain.com"
            value={computedEmail || ""} // need this empty string for React to "control" this input field
            onChange={(e) => setEmail(e.target.value)}
          />
          <EmailNote>
            For receipt and account creation on your terms. We will NOT spam
            you.
          </EmailNote>
          <CardElementContainer>
            <CardElement
              options={{
                style: {
                  base: {
                    fontFamily: fontFamily,
                    fontSize: isSmallScreen ? smInputFontSize : lgInputFontSize,
                  },
                },
              }}
            />
          </CardElementContainer>
          <BuyButton
            type="simpleQuery"
            onClick={(e) => handlePurchaseProcess(e)}
            disabled={!stripe || isLoading}
          >
            PURCHASE
          </BuyButton>
          {!isLoading && errorMsg && (
            <AlertMessage style={{ marginTop: "3px" }} text={errorMsg} />
          )}
        </>
      )}
    </PaymentFormContainer>
  );
}

const CheckoutForm = observer((props) => {
  return (
    <Elements stripe={getStripe(props.settings)}>
      <CheckoutFormConsumer
        appStore={props.appStore}
        onCloseClick={props.onCloseClick}
        sessionData={props.sessionData}
      />
    </Elements>
  );
});

export default CheckoutForm;
