from api.email_templates import confirm_reg_create_account


def test_confirm_reg_create_account():
    body_parts = confirm_reg_create_account(
        "Benicio del Toro", "1/1/2020"
    )
    assert "Benicio del Toro" in body_parts['email_body'] and "1/1/2020" in body_parts['email_body']


def test_make_template():
    params = {
        "student_name": "Benicio del Toro",
        "student_email": "benicio@toro.io",
        "module_name": "Intermediate Class",
        "module_session_start_dt": "1/1/2020",
        "change_pass_ticket_link": "https://change-pass"}
    populated_template = confirm_reg_create_account(**params)
    message = populated_template['Messages'][0]

    assert params["student_name"] in message["TextPart"]
    assert params["student_email"] in message["To"][0]["Email"]

