from sqlalchemy import and_, or_

import database.models as m
import logging

from app_context import red

LOG = logging.getLogger(__name__)


def create_user(email, full_name=None, first_name=None, last_name=None):
    existing_user = m.User.query.filter(
        or_(
            and_(
                m.User.firstname == first_name,
                m.User.lastname == last_name,
                m.User.email == email),

            and_(
                m.User.fullname == full_name,
                m.User.email == email)
        )
    ).one_or_none()

    if existing_user:
        LOG.warning(f"User with email {existing_user.email} exists already, returning")
        return existing_user

    _user = m.User(
        firstname=first_name,
        lastname=last_name,
        email=email
    )
    _user.add()
    LOG.info(f"New user registered with email address: {_user.email}")
    return _user


# We might not need this anymore.
def create_partial_user(fullname, email) -> m.User:
    """
    Creates a user with the only thing we have during anonymous class purchase: the user's email.
    Checks if user already exists with provided email.
    :return: User. A SQLAlchemy User object.
    """
    LOG.debug(f"Creating partial user with email {email}")
    existing_user = m.User.query.filter(m.User.email == email).one_or_none()

    if existing_user:
        LOG.warning(f"Partial user creation determined that user with email {existing_user.email} exists already."
                    f"Proceeding with this email address.")
        return existing_user

    _user = m.User(
        fullname=fullname,
        email=email
    )
    _user.add()

    return _user


def get_module_session_by_id(_id):
    LOG.debug(f"Retrieving module session with id {_id}")
    return m.ModuleSession.query.filter_by(id=_id).one()


def user_module_registrations_by_user_id(user_id):
    LOG.debug(f"Retrieving module sessions for user id {user_id}")
    return m.UserModuleRegistration.query.filter_by(user_id=user_id).all()


def _make_key(user_id):
    return f"user_id_{user_id}_session_in_progress"


def store_session_in_progress(user_id):
    red.set(_make_key(user_id), "true")


def get_session_in_progress(user_id):
    return red.get(_make_key(user_id)).decode('utf-8') == "true"


def remove_session_in_progress(user_id):
    red.delete(_make_key(user_id))
