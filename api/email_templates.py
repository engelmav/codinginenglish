from jinja2 import Template


def make_template(student_email, student_name, module_name, body_parts):
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
    return data


confirm_registration = {
    "email_body": Template("Dear {{ student_name }},"
                           "Thank you for registering. Your class will begin on {{ module_session_start_dt }}.</p>"
                           "Sincerely,%0AVincent Caudo Engelmann"),

    "html_body": Template("<p>Dear {{ student_name }},</p><p>Thank you for registering.</p>"
                          "Your class will begin on {{ module_session_start_dt }}.</p>"
                          "<br>Coding in English</p>"),
    "CustomID": "ClassRegistration"
}


def confirm_reg_create_account(student_name, module_session_start_dt):
    return {
        "email_body": Template("Dear {{ student_name}},%0A"
                               "Thank you for registering. Your class will begin on {{ module_session_start_dt }}.</p>"
                               "Coding in English").render(
            student_name=student_name, module_session_start_dt=module_session_start_dt),
        "html_body": Template("<p>Dear {{ student_name }},</p><p>Thank you for registering.</p>"
                              "Your class will begin on {{ module_session_start_dt }}.</p>"
                              "<p>Please create your account as soon as possible by clicking the below link:</p>"
                              "<p>{{ reset_password_ticket }}</p>"
                              "<p>Sincerely,<br/>Vincent Caudo Engelmann</p>"),
        "CustomID": "ClassRegistrationNoAccount"
    }
