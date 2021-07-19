import requests
from urllib.parse import urljoin


class RequestSession(requests.Session):
    def __init__(self, url_base=None, *args, **kwargs):
        super(RequestSession, self).__init__(*args, **kwargs)
        self.url_base = url_base

    def request(self, method, url, **kwargs):
        modified_url = urljoin(self.url_base, url)
        return super(RequestSession, self).request(method, modified_url, **kwargs)