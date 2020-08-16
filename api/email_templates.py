from jinja2 import Template


def _make_template(student_email, student_name, module_name, body_parts):
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


def confirm_reg_create_account(student_name, student_email, module_name, module_session_start_dt, ticket_link):
    body = Template("Dear {{ student_name}},%0A"
                    "Thank you for registering for {{ module_name}} at Coding in English."
                    "Your class will begin on {{ module_session_start_dt }}."
                    "To prepare for access to your upcoming class, please create your account as soon as possible by"
                    "clicking the below link:%0A"
                    "{{ reset_password_ticket }}"
                    "Sincerely,%0AVincent Caudo Engelmann, Coding in English").render(
        student_name=student_name, module_name=module_name, module_session_start_dt=module_session_start_dt,
        reset_password_ticket=ticket_link)
    html_body = Template("<p>Dear {{ student_name }},</p>"
                         "<p>Thank you for registering for {{ module_name}} at Coding in English.</p>"
                         "Your class will begin on {{ module_session_start_dt }}.</p>"
                         "<p>Please create your account as soon as possible by clicking the below link:</p>"
                         "<p>{{ reset_password_ticket }}</p>"
                         "<p>Sincerely,<br/>Vincent Caudo Engelmann, Coding in English</p>").render(
        student_name=student_name, module_name=module_name, module_session_start_dt=module_session_start_dt,
        reset_password_ticket=ticket_link)

    body_parts = _main_part(body, html_body, "ClassRegNoAccount")
    return _make_template(student_email, student_name, module_name, body_parts)
