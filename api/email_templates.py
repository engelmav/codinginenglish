"""
All templates must confirm to the MailJet API spec described here:
https://app.mailjet.com/transactional/sendapi
"""
import requests
import base64
from jinja2 import Template


def _make_template(student_email, student_name, module_name, body_parts, attachments=None):
    data = {
        'Messages': [
            {
                "From": {
                    "Email": "support@codinginenglish.com",
                    "Name": "Vincent"
                },
                "To": [
                    {
                        "Email": student_email,
                        "Name": student_name
                    }
                ],
                "Subject": f"Class Registration: {module_name}",
            }
        ]
    }
    for part in body_parts:
        data['Messages'][0][part] = body_parts[part]
    if attachments:
        data['Messages'][0]['Attachments']: attachments
    return data


def _main_part(body, html_body, custom_id):
    return {
        "TextPart": body,
        "HTMLPart": html_body,
        "CustomID": custom_id
    }


def confirm_registration(student_name, student_email, module_name, module_session_start_dt):
    body = Template("Dear {{ student_name}},%0A"
                    "Thank you for registering for {{ module_name}} at Coding in English."
                    "Your class will begin on {{ module_session_start_dt }}."
                    "Sincerely,%0AVincent Caudo Engelmann, Coding in English").render(
        student_name=student_name, module_name=module_name, module_session_start_dt=module_session_start_dt)
    html_body = Template("<p>Dear {{ student_name }},</p>"
                         "<p>Thank you for registering for {{ module_name}} at Coding in English.</p>"
                         "Your class will begin on {{ module_session_start_dt }}.</p>"
                         "<p>Sincerely,<br/>Vincent Caudo Engelmann, Coding in English</p>").render(
        student_name=student_name, module_name=module_name, module_session_start_dt=module_session_start_dt)
    body_parts = _main_part(body, html_body, "ClassReg")
    return _make_template(student_email, student_name, module_name, body_parts)


def confirm_reg_create_account(
        student_name,
        student_email,
        module_name,
        module_session_start_dt,
        change_pass_ticket_link):
    """
    Confirms class registration and includes a link to setup student's account.
    :param student_name:
    :param student_email:
    :param module_name:
    :param module_session_start_dt:
    :param change_pass_ticket_link: the link used to reset student's the password.
    :return:
    """
    body = Template("Dear {{ student_name}},%0A"
                    "Thank you for registering for {{ module_name }} at Coding in English."
                    "Your class will begin on {{ module_session_start_dt }}."
                    "To prepare for access to your upcoming class, please create your account as soon as possible by"
                    "clicking the below link:%0A"
                    "{{ reset_password_ticket }}"
                    "Sincerely,%0AVincent Caudo Engelmann, Coding in English").render(
        student_name=student_name, module_name=module_name, module_session_start_dt=module_session_start_dt,
        reset_password_ticket=change_pass_ticket_link)
    html_body = Template("<p>Dear {{ student_name }},</p>"
                         "<p>Thank you for registering for {{ module_name }} at Coding in English.</p>"
                         "Your class will begin on {{ module_session_start_dt }}.</p>"
                         "<p>Please create your account as soon as possible by clicking the below link:</p>"
                         "<p>{{ reset_password_ticket }}</p>"
                         "<p>Sincerely,<br/>Vincent Caudo Engelmann, Coding in English</p>").render(
        student_name=student_name, module_name=module_name, module_session_start_dt=module_session_start_dt,
        reset_password_ticket=change_pass_ticket_link)

    body_parts = _main_part(body, html_body, "ClassRegNoAccount")
    return _make_template(student_email, student_name, module_name, body_parts)


def curriculum_request(requester_email):
    body = Template("¡Hola!,%0A"
                    "Gracias por tu interés en Coding in English."
                    "Anexado está el currículo del curso {{course}}."
                    "El próximo curso empieza el 4 de enero 2022."
                    "Sincerely,%0AVincent Caudo Engelmann, Coding in English").render(
        course="WebApp Development - Basic")
    html_body = Template("<p>¡Hola!</p>"
                         "<p>Gracias por tu interés en Coding in English.</p>"
                         "<p>Anexado está el currículo del curso {{course}}.</p>"
                         "<p>El próximo curso empieza el 4 de enero 2022."
                         "<p>Cordialmente,<br/>Vincent Caudo Engelmann, Coding in English</p>").render(
        course="WebApp Development - Basic")
    body_parts = _main_part(body, html_body, "CurriculumRequest")
    curriculum_resp = requests.get("https://cie-assets.nyc3.cdn.digitaloceanspaces.com/WebAppDevelopment_Basic_CIE_2021_Sep_20.pdf")
    attachments = [{
            "ContentType": "application/pdf",
            "Filename": "WebAppDevelopment-Basic-20Sep2021.pdf",
            "Base64Content": base64.b64encode(curriculum_resp.content).decode("utf-8")
        }]

    data = {
        'Messages': [
            {
                "From": {
                    "Email": "support@codinginenglish.com",
                    "Name": "Vincent"
                },
                "To": [
                    {
                        "Email": requester_email,
                        "Name": "TO NAME"
                    }
                ],
                "Subject": f"Coding in English - WebApp Development - Basic",
            }
        ]
    }
    for part in body_parts:
        data['Messages'][0][part] = body_parts[part]

    data['Messages'][0]['Attachments'] = attachments
    return data

class MessageList:
    def __init__(self):
        self.message_list = {
            "Messages": []
        }
    def add_message(self, message):
        self.message_list["Messages"].append(message)


class Message:
    def __init__(self):
        self.data = {
            'Messages': [
                {
                    "From": {
                        "Email": "",
                        "Name": ""
                    },
                    "To": [
                        {
                            "Email": "",
                            "Name": ""
                        }
                    ],
                    "Subject": "",
                }
            ]
        }
        for part in body_parts:
            data['Messages'][0][part] = body_parts[part]
        if attachments:
            data['Messages'][0]['Attachments']: attachments
    def add_message(self):
        pass

    def to(self, to, name):
        pass
    def _from(self, _from, name):
        pass
    def subject(self, subject):
        pass
    