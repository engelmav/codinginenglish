from flask import Blueprint, jsonify, request
import stripe
import logging

from config import config

LOG = logging.getLogger(__name__)
stripe_bp = Blueprint('stripe_payments', __name__)
stripe_secret = config.get('cie.api.stripe.secretkey')
stripe_publishable_key = config.get('cie.api.stripe.publishablekey')

stripe.api_key = stripe_secret


def calc_order_amount(item):
    # TODO: pull from database
    return 100


@stripe_bp.route('/payment/create-payment-intent', methods=['POST'])
def create_payment():
    data = request.get_json()
    LOG.info("Creating payment: %s" % str(data))
    intent = stripe.PaymentIntent.create(
        amount=calc_order_amount(data.get('item')),
        currency=data.get('currency'),
        payment_method_types=['card'],
        metadata={'integration_check': 'accept_a_payment'}
    )
    LOG.info("Processing payment id {} currency {}.".format(intent.stripe_id, intent.currency))
    return jsonify(
        {
            'publishableKey': stripe_publishable_key,
            'clientSecret': intent.client_secret
        }
    )
