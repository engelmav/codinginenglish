from sqlalchemy import and_

import database.models as m
import logging


LOG = logging.getLogger(__name__)


def create_user(first_name, last_name, email):
    existing_user = m.User.query.filter(
        and_(
            m.User.firstname == first_name,
            m.User.lastname == last_name,
            m.User.email == email)
    ).one_or_none()

    if existing_user:
        LOG.warning("User with email {} exists already, returning".format(existing_user.email))
        return existing_user

    _user = m.User(
        firstname=first_name,
        lastname=last_name,
        email=email
    )
    _user.add()
    LOG.info("New user registered with email address: {}".format(_user.email))
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
