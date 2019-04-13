import falcon
from falcon import testing
import pytest

from api import api


@pytest.fixture
def client():
    return testing.TestClient(api)


def test_get_user(client):
    user = {
        "name": "Emiliano Russo"
    }

    response = client.simulate_get('/students')
    print(response)