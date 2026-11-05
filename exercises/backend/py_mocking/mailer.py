"""The real mailer. Do not change this file."""


def send_email(to, text):
    """Send an email through the library's mail server."""
    raise RuntimeError(f"send_email tried to reach the mail server for {to}: there is no network in tests")
