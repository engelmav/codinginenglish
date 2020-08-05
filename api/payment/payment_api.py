from services.auth import create_auth_user, create_auth0_passwd_reset
from config import config
from services.mailjet import send_mail
from services.cie import get_module_session_by_id, create_user

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
        res = validate_email(email)
        # TODO: normalize and put into db
    except EmailNotValidError as e:
        LOG.error(f"Email {email} failed validation. Returning 400 to client. See traceback.", exc_info=True)
        # we need to return 200 OK for a validation error, otherwise we don't get the JSON returned.
        return jsonify(success=True, message="Invalid email address.", errors=e.args), 200

    return jsonify(success=True, message="Email address is valid.")


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
    LOG.error("Some part of the CIE payment process failed, either email validation or payment intent creation. "
              "See the object printed below. This is the `error` object of the try/catch for handleSubmit().")
    fail_json = request.get_json()
    LOG.error(fail_json)
    return jsonify(success=True, message="A payment attempt failed. This is logged in the backend.")


def email_logged_in():
    pass


def email_no_account():
    pass


def email_logged_out():
    pass


@stripe_bp.route('/api/payment/confirmation', methods=['PUT'])
def confirm_payment():
    """
    Three situations:
    1) you hit this endpoint after paying, with NO account.
    2) you hit this endpoint after paying, WITH an account but not logged in.
    3) you hit this endpoint after paying, WITH an account AND logged in.
    We don't have JWTs set up here yet, which would be ideal. But we can pass logged in flag at least.
    :return:
    """
    confirmation_details = request.get_json()

    email = confirmation_details.get('email')  # this is already validated in create-payment-intent
    student_name = confirmation_details.get('name')

    is_authenticated = confirmation_details.get('isAuthenticated')
    if student_name is None or '':
        student_name = 'Student'

    email_template = templates.confirm_registration_create_account
    if not is_authenticated:
        # User is either not signed in, or has no account.
        created_user = create_auth_user(student_name, email)
        create_user()
        passwd_reset = create_auth0_passwd_reset(email)

    module_session_id = confirmation_details.get('moduleSessionId')
    try:
        module_session = get_module_session_by_id(module_session_id)
        module_session_start_dt = module_session.session_datetime
        module_name = module_session.cie_module.name
    except:
        LOG.error(f"Could not retrieve module session details for email confirmation. Confirmation details: "
                  f"{confirmation_details}. Aborting.", exc_info=True)
        return jsonify(success=False, message='Could not retrieve module session details.')

    # At this point, we should have all the template info we need.
    try:
        resp = send_mail(student_name, email, module_name, module_session_start_dt)
        # get status code in resp object and raise exception/log error if not 200
        LOG.debug(resp)
    except:
        LOG.error('Email confirmation failed. See traceback.', exc_info=True)
        return jsonify(success=False, message="Check server log for details.")

    return jsonify(success=True, message="Successfully sent email confirmation")
