from services.auth import create_auth0_user, create_auth0_passwd_reset, get_auth0_user
from config import config
from services.cie import ModuleService
from services.mailjet import send_mail

from flask import Blueprint, jsonify, request
import stripe
from email_validator import validate_email, EmailNotValidError
import email_templates as templates

import logging


LOG = logging.getLogger(__name__)
stripe_bp = Blueprint('stripe_payments', __name__)
stripe_secret = config.get('cie.api.stripe.secretkey')
stripe_publishable_key = config.get('cie.api.stripe.publishablekey')

stripe.api_key = stripe_secret


def create_payment_api(module_service: ModuleService):
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

        student_email = confirmation_details.get('email')  # this is already validated in create-payment-intent
        student_name = confirmation_details.get('name')

        is_authenticated = confirmation_details.get('isAuthenticated')
        no_auth0_user = get_auth0_user(student_email).get('total') == 0

        if student_name is None or "":
            student_name = 'Student'

        template_params = [student_name, student_email]

        module_session_id = confirmation_details.get('moduleSessionId')
        try:
            module_name, module_session_start_dt = module_service.get_module_details(module_session_id)
        except:
            LOG.error(f"Could not retrieve module session details for email confirmation. Confirmation details: "
                      f"{confirmation_details}. Aborting.", exc_info=True)
            return jsonify(status="error", messages=["Could not retrieve module session details."])

        template_params += [module_name, module_session_start_dt]

        if not is_authenticated and no_auth0_user:
            confirmation_email = handle_new_user(student_email, student_name, template_params)
        else:
            confirmation_email = templates.confirm_registration(*template_params)

        # At this point, we should have all the template info we need.
        try:
            resp = send_mail(confirmation_email)
            # get status code in resp object and raise exception/log error if not 200
            LOG.debug(f"Response from send_mail: {resp}")
            if resp.status_code != 200:
                raise Exception(f"Error sending confirmation email. Error text: {resp.text}")
        except:
            LOG.error('Email confirmation failed. See traceback.', exc_info=True)
            return jsonify(success=False, message="Check server log for details.")

        return jsonify(success=True, message="Successfully sent email confirmation")

    def handle_new_user(student_email, student_name, template_params):
        # TODO: UUID not serializable
        _ = create_auth0_user(student_name, student_email)
        create_user(student_email, full_name=student_name)
        passwd_reset_ticket = create_auth0_passwd_reset(student_email)
        template_params.append(passwd_reset_ticket["link"])
        body_parts = templates.confirm_reg_create_account(*template_params)
        return body_parts

    return stripe_bp
