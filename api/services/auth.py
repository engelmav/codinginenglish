from auth0.v3.authentication import GetToken
from auth0.v3.management import Auth0, Users, Tickets
from passlib import pwd

from config import config, AUTH0_DB_CONN

import logging
import uuid

LOG = logging.getLogger(__name__)


domain = 'dev-nougy3g5.auth0.com'
client_id = 'H0HnVfwjWWZkh6GHLWQgS5s03s2TY1m7'
client_secret = config.get("cie.auth0.secretkey")
API_ENDPOINT = 'https://{}/api/v2/'.format(domain)

get_token = GetToken(domain)
token = get_token.client_credentials(client_id, client_secret, API_ENDPOINT)
mgmt_api_token = token['access_token']


def create_auth0_user(full_name, user_email):
    user_id = uuid.uuid4()
    users = Users(domain, mgmt_api_token)
    user_res = users.create({
      "email": user_email,
      "user_metadata": {"was_invite": True},
      "blocked": False,
      "email_verified": False,
      "app_metadata": {},
      # "given_name": "Vinnie from API",
      # "family_name": "Engelmann",
      # "name": "Vinnie",
      "nickname": full_name,
      "picture": "https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl"
                 ".gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png",
      "user_id": user_id,
      "connection": "Username-Password-Authentication",
      "password": pwd.genword(),
      "verify_email": True,
    })
    LOG.info(f"Created user in auth0 for email {user_email} with user_id {user_id}")
    return user_res


def create_auth0_passwd_reset(user_email):
    tickets = Tickets(domain, mgmt_api_token)
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
    print(ticket_res)
    return ticket_res

    #
# resp = requests.post('https://{}/oauth/token'.format("login.codinginenglish.com"),
#              data={"grant_type": "client_credentials", "client_id": client_id, "client_secret": client_secret,
#                    "audience": "https://dev-nougy3g5.auth0.com/api/v2/"})
# headers = {'authorization': resp.json().get("access_token")}
#
# requests.delete(
#     'https://login.codinginenglish.com/api/v2/users/auth0/identities/google-oauth2/111239133715150760465',
#     headers=headers)
