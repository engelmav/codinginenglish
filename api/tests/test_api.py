from datetime import datetime, timedelta, timezone

from tests.fixtures import make_test_app
#
# def _uuid():
#     return str(uuid.uuid4())[:8]
#
#
# def _create_module(name):
#     mod = CieModule(
#         name=name
#     )
#     mod.add()
#     return mod
#
#
# def _create_user(firstname=None, lastname=None):
#     if firstname is None:
#         firstname = _uuid()
#     if lastname is None:
#         lastname = _uuid()
#     user = User(firstname=firstname, lastname=lastname)
#     return user
#
#
# def test_add_user(yo):
#     u = _create_user()
#
#
# def test_add_module():
#     mod_name = "Cie Module Creation Test"
#     _create_module(mod_name)
#     m = CieModule.query.filter(CieModule.name == mod_name).one()
#     assert m.name == mod_name
#
#
# def test_add_session_to_module():
#     mod_name = "Cie Module Creation Test" + _uuid()
#     mod =_create_module(mod_name)
#     res = test_client.post(f'/cie-modules/{mod.id}/sessions', json={'session_datetime': datetime(2019, 6, 5, 8, 10, 10, 10).isoformat()})
#     res_j = res.json
#     print(res_j)
#
#
# def test_create_module_endpoint():
#     res = test_client.post('/modules', json=
#         [
#             {
#                 "name": "value",
#                 "description": "value"
#             }
#         ]
#     )
#     assert res.json['name'] == 'value'
#
#
# def test_add_user_to_module():
#     user = User(firstname='Test', lastname='User')
#     user.add()
#     mod_name = "Test Module - Add User"
#     _create_module(mod_name)
#     m = CieModule.query.filter(CieModule.name == mod_name).one()
#     sess = ModuleSession(cie_module_id=m.id, session_datetime=datetime(2015, 6, 5, 8, 10, 10, 10))
#     sess.add()
#     m.add_user(user, sess)


# def test_add_user_to_module_session_endpoint():
#     user = _create_user()
#     res = test_client.post(f'/module-sessions/{session_id}/users', json=)


# def test_get_modules():
#     all = CieModule.query.all()
#     print(all)
#
#
# def test_get_all_module_sessions():
#     all = ModuleSession.query.all()
#     print(all)
#
#
# def test_get_all_module_sessions_endpoint():
#     res = test_client.get('/module-sessions').json
#     print(res)
#
#
# def test_get_modules_endpoint():
#     mod_name = "Cie Module Creation Test"
#     _create_module(mod_name)
#     res = test_client.get('/modules').json
#
#
# def test_payment_confirmation():
#     payload = {
#         "email": "lorenzo@lambourghini.com",
#         "name": "Lorenzo Saenz",
#         "isAuthenticated": False
#     }
#     res = test_client.put('/api/payment/confirmation', json=payload)

def test_get_future_sessions():
    now = datetime.now(timezone.utc)
    five_hours = timedelta(hours=5)
    five_hours_from_now = now + five_hours
    five_hours_ago = now - five_hours

    upcoming_sessions = [
        {"session_id": 1, "session_datetime": five_hours_from_now},
        {"session_id": 1, "session_datetime": five_hours_ago}
    ]
    test_app = make_test_app(upcoming_sessions)
    test_user_id = "1"
    resp = test_app.get(f"/api/users/{test_user_id}/module-sessions",
                        query_string={"futureOnly": "true"})
    expected_date_str = five_hours_from_now.strftime('%a, %-d %b %Y %H:%M:%S %Z')
    recvd_start_dt = resp.json.get('data')[0].get('start_date')
    recvd_start_dt_utc = recvd_start_dt.replace('GMT', 'UTC')  # oh yes, that happened.
    assert recvd_start_dt_utc == expected_date_str
    assert len(resp.json.get('data')) == 1




