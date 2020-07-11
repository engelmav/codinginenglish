from config import config
from services.mailjet import send_mail
from services.cie import get_module_session_by_id

from flask import Blueprint, jsonify, request
import stripe
from email_validator import validate_email, EmailNotValidError

import logging



LOG = logging.getLogger(__name__)
stripe_bp = Blueprint('stripe_payments', __name__)
stripe_secret = config.get('cie.api.stripe.secretkey')
stripe_publishable_key = config.get('cie.api.stripe.publishablekey')

stripe.api_key = stripe_secret


def calc_order_amount(item):
    # TODO: pull from database
    # get_module_session_by_id
    return 200


@stripe_bp.route('/api/payment/validate-email', methods=['PUT'])
def _validate_email():
    email = request.get_json().get('email')
    try:
        validate_email(email)
        # TODO: normalize and put into db
    except EmailNotValidError as e:
        LOG.error(f"Email {email} failed validation. Returning 400 to client. See traceback.", exc_info=True)
        return jsonify(success=False, message="Invalid email address."), 400

    return jsonify(success=True, message="Email address is valid.")


@stripe_bp.route('/api/payment/create-payment-intent', methods=['POST'])
def create_payment():
    LOG.info("Creating payment: %s" % str(data))
    try:
        intent = stripe.PaymentIntent.create(
            amount=calc_order_amount(data.get('item')),
            currency=data.get('currency'),
            receipt_email=email,
            payment_method_types=['card'],
            metadata={'integration_check': 'accept_a_payment'}
        )
    except:
        LOG.error("Failed to create payment intent. Returning 500 to client.", exc_info=True)
        # TODO: RFC-7807
        return jsonify(success=False, message="Error creating payment intent. Check server log."), 500
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


@stripe_bp.route('/api/payment/confirmation', methods=['PUT'])
def confirm_payment():
    confirmation_details = request.get_json()

    email = confirmation_details.get('email')  # this is already validated in create-payment-intent
    student_name = confirmation_details.get('name')
    if student_name is None or '':
        student_name = 'Student'

    module_session_id = confirmation_details.get('moduleSessionId')
    try:
        module_session = get_module_session_by_id(module_session_id)
        module_session_start_dt = module_session.session_datetime
        module_name = module_session.cie_module.name
    except:
        LOG.error(f"Could not retrieve module session details for email confirmation. Confirmation details: "
                  f"{confirmation_details}. Aborting.", exc_info=True)
        return jsonify(success=False, message="Could not retrieve module session details.")

    # At this point, we should have all the template info we need.
    try:
        resp = send_mail(student_name, email, module_name, module_session_start_dt)
        # get status code in resp object and raise exception/log error if not 200
        LOG.debug(resp)
    except:
        LOG.error("Email confirmation failed. See traceback.", exc_info=True)
        return jsonify(success=False, message="Check server log for details.")

    return jsonify(success=True, message="Successfully sent email confirmation")
