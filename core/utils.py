from base64 import urlsafe_b64encode
from uuid import uuid4


def make_slug():
    return str(urlsafe_b64encode(uuid4().bytes).strip(b'='), encoding='utf-8')
