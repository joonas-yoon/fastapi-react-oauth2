from urllib import parse as URI


def params_to_uri(params: dict):
    return "&".join([f"{key}={URI.quote(val)}" for (key, val) in params.items()])
