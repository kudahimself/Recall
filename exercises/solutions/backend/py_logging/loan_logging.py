"""Logging: reference solution."""
import logging

log = logging.getLogger("library.loans")


def configure():
    logging.getLogger("library").setLevel(logging.INFO)


def lend(title, member):
    log.info("lent %s to %s", title, member)
    return f"{title} -> {member}"


def check_return(title, days_late):
    if days_late > 0:
        log.warning("%s returned %d days late", title, days_late)
    else:
        log.debug("%s returned on time", title)


def renew_all(titles, renew):
    renewed = []
    for title in titles:
        try:
            renew(title)
        except Exception:
            log.exception("renewal failed for %s", title)
        else:
            renewed.append(title)
    return renewed
