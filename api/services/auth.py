from auth0.v3.authentication import GetToken
from auth0.v3.management import Users, Tickets
from passlib import pwd

from config import config, AUTH0_DB_CONN

import logging
import uuid

LOG = logging.getLogger(__name__)


domain = 'dev-nougy3g5.auth0.com'
client_id = 'H0HnVfwjWWZkh6GHLWQgS5s03s2TY1m7'
client_secret = config.get("cie.auth0.secretkey")
API_ENDPOINT = 'https://{}/api/v2/'.format(domain)


class AuthService:
    def __init__(self):
        get_token = GetToken(domain)
        self.token = get_token.client_credentials(client_id, client_secret, API_ENDPOINT)
        self.mgmt_api_token = self.token['access_token']

    def get_auth0_user(self, email):
        user = Users(domain, self.mgmt_api_token).list(q=f"email={email}")
        return user

    def create_auth0_user(self, full_name, user_email):
        user_id = str(uuid.uuid4())
        users = Users(domain, self.mgmt_api_token)
        generated_password = pwd.genword(entropy=56, charset="ascii_62")
        user_res = users.create({
          "email": user_email,
          "user_metadata": {"was_invite": True},
          "blocked": False,
          "email_verified": False,
          "app_metadata": {},
          "nickname": full_name,
          "picture": "https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl"
                     ".gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png",
          "user_id": user_id,
          "connection": "Username-Password-Authentication",
          "password": generated_password,
          "verify_email": True,
        })
        LOG.info(f"Created user in auth0 for email {user_email} with user_id {user_id}")
        return user_res

    def create_auth0_passwd_reset_ticket(self, user_email):
        tickets = Tickets(domain, self.mgmt_api_token)
        two_days = 172800
        ticket_res = tickets.create_pswd_change({
            "result_url": "https://www.codinginenglish.com/login",
            "connection_id": AUTH0_DB_CONN,
            "email": user_email,
            "ttl_sec": two_days,
            "mark_email_as_verified": True,
            "includeEmailInRedirect": True
        })
        LOG.info(f"Password reset ticket generated for user {user_email}: {ticket_res}")
        ticket_link = ticket_res.get("ticket")
        better_link = ticket_link.replace("dev-nougy3g5.auth0", "login.codinginenglish")
        return better_link
