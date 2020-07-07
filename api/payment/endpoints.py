from flask import Blueprint, jsonify, request
import stripe
import logging

from config import config
from services.mailjet import send_mail

LOG = logging.getLogger(__name__)
stripe_bp = Blueprint('stripe_payments', __name__)
stripe_secret = config.get('cie.api.stripe.secretkey')
stripe_publishable_key = config.get('cie.api.stripe.publishablekey')

stripe.api_key = stripe_secret


def calc_order_amount(item):
    # TODO: pull from database
    return 200


@stripe_bp.route('/api/payment/create-payment-intent', methods=['POST'])
def create_payment():
    data = request.get_json()
    LOG.info("Creating payment: %s" % str(data))
    try:
        intent = stripe.PaymentIntent.create(
            amount=calc_order_amount(data.get('item')),
            currency=data.get('currency'),
            receipt_email=data.get('email'),
            payment_method_types=['card'],
            metadata={'integration_check': 'accept_a_payment'}
        )
    except:
        LOG.error("Failed to create payment intent.", exc_info=True)
        # TODO: RFC-7807
        return jsonify(error="Error creating payment intent. Check server log."), 500
    LOG.info(f"Processing payment id {intent.stripe_id} currency {intent.currency}.")
    return jsonify(
        {
            'publishableKey': stripe_publishable_key,
            'clientSecret': intent.client_secret
        }
    )


@stripe_bp.route('/api/payment/failure', methods=['POST'])
def payment_failure():
    LOG.error("A payment attempt failed. See details below.")
    LOG.error(request.get_json())


@stripe_bp.route('/api/payment/confirm', methods=['PUT'])
def confirm_payment():
    try:
        resp = send_mail()
        LOG.debug(resp)
    except:
        LOG.error("Email confirmation failed. See traceback.", exc_info=True)
        return jsonify(success=False, message="Check server log for details.")
    return jsonify(success=True, message="Successfully sent email confirmation")
