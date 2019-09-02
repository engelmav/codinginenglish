from services.rocketchat_service import RocketChatService
from config import config

from urllib.parse import urljoin


import responses


@responses.activate
def test_auth_headers():
    base_url = config['cie.rocketchat.api_url']
    responses.add(
        responses.POST,
        urljoin(base_url, '/api/v1/login'),
        json={
            "status": "success",
            "data": {
                "userId": "romanosofia",
                "authToken": "vienenpronto"
            }
        }
    )

    r = RocketChatService('user', 'pass', base_url)
    assert r.session.headers['X-TokenAuth'] == "vienenpronto"
    assert r.session.headers['X-User-Id'] == "romanosofia"
