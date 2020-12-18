from sqlalchemy import and_, or_
from datetime import datetime, timedelta

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
    LOG.debug(f"get_module_session_by_id(): Retrieving module session with id {_id}")
    return m.ModuleSession.query.filter_by(id=_id).one()


def is_already_started(self, session_start_dt):
    now = datetime.now()
    already_started = session_start_dt < now
    return already_started

def is_ended(self, session_start_dt):
    end_dt = session_start_dt + timedelta(hours=1, minutes=30)
    now = datetime.now()
    ended = now < end_dt
    return ended


def get_upcoming_sessions_by_user_id(user_id):
    LOG.debug(f"Retrieving module sessions for user id {user_id}")
    """
    Ok, so we only care about classes that
    * haven't started yet
      what does havent started yet look like?
      it means that start_dt is in the future.
      
    * but what if they already started, and they haven't ended yet?
      how do we figure that out?
      well, the end_dt is start_dt + duration.
      
      so,
          end_dt = start_dt + duration
          
      so if right now is less than end_dt AND right now is greater than start_dt,
      then you're in the middle of a class.
    """
    results = m.UserModuleRegistration \
        .query \
        .join(m.ModuleSession) \
        .filter(m.UserModuleRegistration.user_id == user_id) \
        .all()

    upcoming_sessions = []
    for user_registration in results:
        session_start_dt = user_registration.module_session.session_datetime
        in_progress = is_already_started(session_start_dt) and not is_ended(session_start_dt)
        not_started_yet = session_start_dt > datetime.now()
        if not_started_yet or in_progress:
            upcoming_sessions.append(user_registration)
    return upcoming_sessions


def _make_key(user_id):
    return f"user_id_{user_id}_session_in_progress"


def set_session_in_progress(user_id):
    LOG.debug(f"Setting session_in_progress for user id {user_id}")
    red.set(_make_key(user_id), "true")


def is_session_in_progress(user_id):
    return red.get(_make_key(user_id)).decode('utf-8') == "true"


def remove_session_in_progress(user_id):
    red.delete(_make_key(user_id))
