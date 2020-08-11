from config import config
from mailjet_rest import Client

api_key = config.get('cie.mailjet.api_key')
api_secret = config.get('cie.mailjet.api_secret')

mailjet = Client(auth=(api_key, api_secret), version='v3.1')


def send_mail(populated_template):
    return mailjet.send.create(data=populated_template)
