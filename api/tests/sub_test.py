import json
import pprint

import sseclient


def with_requests(url):
    """Get a streaming response for the given event feed using requests."""
    import requests
    return requests.get(url, stream=True)


# url = 'http://localhost:5000/listen'
url = 'http://localhost:5000/api/stream'
response = with_requests(url)  # or with_requests(url)
client = sseclient.SSEClient(response)
for event in client.events():
    print(event.data)
    # pprint.pprint(json.loads(event.data))
