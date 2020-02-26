from flask import Blueprint, jsonify, request
import stripe

from config import config


stripe = Blueprint('stripe_payments', __name__)
stripe_secret = config.get('cie.api.stripe.secretkey"')
stripe_publishable_key =  config.get('cie.api.stripe.publishableKey')


def calc_order_amount(item):
    # TODO: pull from database
    return 50


@stripe.route('/payment/create-payment-intent', methods=['POST'])
def create_payment():
    data = request.data.get_json()
    intent = stripe.PaymentIntent.create(
        amount=calc_order_amount(data.get('item')),
        currency=data.get('currency')
    )
    return jsonify(
        {
            'publishableKey': stripe_publishable_key,
            'clientSecret': intent.client_secret
        }
    )
