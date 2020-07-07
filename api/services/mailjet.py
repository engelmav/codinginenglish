from config import config

from mailjet_rest import Client


api_key = config.get('cie.mailjet.api_key')
api_secret = config.get('cie.mailjet.api_secret')

mailjet = Client(auth=(api_key, api_secret), version='v3.1')
data = {
  'Messages': [
    {
      "From": {
        "Email": "vincent@codinginenglish.com",
        "Name": "Vincent"
      },
      "To": [
        {
          "Email": "vincent.engelmann1@gmail.com",
          "Name": "Vincent Engelmann"
        }
      ],
      "Subject": "Class Registration: Web Development - Basic",
      "TextPart": "<p>Dear student,</p><p>Thank you for registering. Your class will begin on August 12th, 2020.</p>"
                  "<p>Sincerely,<br>Vincent Engelmann</p>",
      "HTMLPart": "<p>Dear student,</p><p>Thank you for registering. Your class will begin on August 12th, 2020.</p>"
                  "<p>Sincerely,<br>Vincent Engelmann</p>",
      "CustomID": "ClassRegistration01"
    }
  ]
}


def send_mail():
    return mailjet.send.create(data=data)

