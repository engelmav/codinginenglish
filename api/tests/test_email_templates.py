from api.email_templates import make_template, confirm_reg_create_account


def test_confirm_reg_create_account():
    body_parts = confirm_reg_create_account(
        "Benicio del Toro", "1/1/2020"
    )
    assert "Benicio del Toro" in body_parts['email_body'] and "1/1/2020" in body_parts['email_body']


def test_make_template():
    body_parts = confirm_reg_create_account(
        "Benicio del Toro", "1/1/2020"
    )
    templ = make_template("benicio@toro.io", "Benicio del Toro", "Intermediate", body_parts)
    print(templ)
    assert "Benicio del Toro" in templ['Messages'][0]['email_body']
