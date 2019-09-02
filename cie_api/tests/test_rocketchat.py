from rocketchat import RocketChatAuth
from unittest.mock import patch

import responses


@responses.activate
def test_urljoin():
    responses.add(
        responses.POST,
        "https://codinginenglish.rocket.chat/api/v1/login",
        json={
            "status": "success",
            "data": {
                "userId": "romanosofia",
                "authToken": "vienenpronto"
            }
        }
    )

    r = RocketChatAuth('user', 'pass')
    assert r.user_id == "romanosofia"
    assert r.token == "vienenpronto"
