from jinja2 import Template


email_body = Template("Dear {{ student_name }}, "
                      "Thank you for registering. Your class will begin on {{ module_session_start_dt }}.</p>"
                      "See you in class."
                      "Coding in English")
html_body = Template("<p>Dear {{ student_name }},</p><p>Thank you for registering. "
                     "Your class will begin on {{ module_session_start_dt }}.</p>"
                     "<p>See you in class,"
                     "<br>Coding in English</p>")
confirm_registration_create_account = {
    "Subject": Template("Class Registration: {{ module_name }}"),
    "TextPart": email_body,
    "HTMLPart": html_body,
    "CustomID": "ClassRegistration01"
}