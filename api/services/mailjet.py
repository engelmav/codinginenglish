from config import config
from mailjet_rest import Client

api_key = config.get('cie.mailjet.api_key')
api_secret = config.get('cie.mailjet.api_secret')

mailjet = Client(auth=(api_key, api_secret), version='v3.1')


def send_mail(student_name, email, module_name, module_session_start_dt):
    data = {
        'Messages': [
            {
                "From": {
                    "Email": "support@codinginenglish.com",
                    "Name": "Vincent"
                },
                "To": [
                    {
                        "Email": email,
                        "Name": student_name
                    }
                ],
                "Subject": f"Class Registration: {module_name}",
                "TextPart": f"Dear {student_name}, "
                            f"Thank you for registering. Your class will begin on {module_session_start_dt}.</p>"
                            "See you in class."
                            "Vincent Engelmann",
                "HTMLPart": f"<p>Dear {student_name},</p><p>Thank you for registering. "
                            f"Your class will begin on {module_session_start_dt}.</p>"
                            "<p>See you in class,<br>Vincent Engelmann</p>",
                "CustomID": "ClassRegistration01"
            }
        ]
    }
    return mailjet.send.create(data=data)
