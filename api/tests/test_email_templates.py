from api.email_templates import make_template, confirm_reg_create_account


def test_confirm_reg_create_account():
    body_parts = confirm_reg_create_account(
        "Benicio del Toro", "1/1/2020"
    )
    assert "Benicio del Toro" in body_parts['email_body'] and "1/1/2020" in body_parts['email_body']


def test_make_template():
    params = ["Benicio del Toro", "1/1/2020", "https://change-pass"]
    body_parts = confirm_reg_create_account(*params)
    templ = make_template("benicio@toro.io", "Benicio del Toro", "Intermediate Class", body_parts)
    email_body = templ['Messages'][0]['email_body']
    for p in params:
        assert p in email_body

