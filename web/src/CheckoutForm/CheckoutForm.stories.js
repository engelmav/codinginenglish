import { CheckoutForm as _CheckoutForm } from "./CheckoutForm";
import { compose } from "../compose";
import React from "react";
import { makeAppStore } from "../stores/AppStore";

const appStore = makeAppStore();

const settings = {
  stripePK: "pk_test_cwKTnilflzQHY5WlR2x2tgwa00KGJyLRrP",
};

const CheckoutForm = compose(_CheckoutForm, {
  appStore, settings,
});


export default {
  title: "CheckoutForm",
  component: CheckoutForm,
};

export const DefaultView = () => <CheckoutForm />;
