from sqlalchemy import and_, or_
import logging
from datetime import datetime


LOG = logging.getLogger(__name__)


class UserService:
    def __init__(self, models):
        self.models = models

    def create_user(self, email, first_name=None, last_name=None):
        m = self.models
        existing_user = m.User.query.filter(
            or_(
                and_(
                    m.User.firstname == first_name,
                    m.User.lastname == last_name,
                    m.User.email == email),

                and_(
                    # m.User.fullname == full_name,
                    m.User.email == email
                )
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
    def create_partial_user(self, fullname, email):
        """
        Creates a user with the only thing we have during anonymous class purchase: the user's email.
        Checks if user already exists with provided email.
        :return: User. A SQLAlchemy User object.
        """
        LOG.debug(f"Creating partial user with email {email}")
        m = self.models
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

    def registered_modules(self, user_id, future_only=False):
        models = self.models

        filters = [models.UserModuleRegistration.user_id == user_id]
        if future_only:
            # models.ModuleSession.query(models.ModuleSession)
            utc_now = datetime.utcnow()
            filters.append(
                models.ModuleSession.session_datetime > utc_now)

        query = (
            models.UserModuleRegistration.query
            .join(models.ModuleSession)
            .join(models.CieModule)
        )

        registered_modules = query.filter(*filters).all()
        modules = []

        class ModuleSessionDTO:
            def __init__(self, module_name, start_date):
                self.module_name = module_name
                self.start_date = start_date

        for module in registered_modules:
            modules.append(ModuleSessionDTO(
                module_name=module.module_session.cie_module.name,
                start_date=module.module_session.session_datetime
            ))

        return modules

    def get_user_by_email(self, email):
        user = self.models.User.query.filter_by(email=email).one_or_none()
        return user


class ModuleService:
    def __init__(self, models):
        self.models = models

    def create_module(self, name, description, image_path=None):
        mod = self.models.CieModule(name=name, description=description, image_path=image_path)
        mod.add()
        return mod

    def get_module_session_by_id(self, _id):
        LOG.debug(f"get_module_session_by_id(): Retrieving module session with id {_id}")
        m = self.models
        return m.ModuleSession.query.filter_by(id=_id).one()

    def get_module_details(self, module_session_id):
        module_session = self.get_module_session_by_id(module_session_id)
        module_session_start_dt = module_session.session_datetime
        module_name = module_session.cie_module.name
        return module_name, module_session_start_dt

