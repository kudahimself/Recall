"""Structured logging: a JSON formatter and the LOGGING setting that uses it."""
import json
import logging

# Every record has these attributes; any other attribute came from extra=.
BUILT_IN = set(vars(logging.makeLogRecord({}))) | {"message", "asctime"}


class JsonFormatter(logging.Formatter):
    def format(self, record):
        entry = {"level": record.levelname, "logger": record.name, "msg": record.getMessage()}
        entry |= {k: v for k, v in vars(record).items() if k not in BUILT_IN}
        if record.exc_info:
            entry["error"] = record.exc_info[0].__name__
            entry["traceback"] = self.formatException(record.exc_info)
        return json.dumps(entry, default=str)


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"json": {"()": "desk_monitor.log_format.JsonFormatter"}},
    "handlers": {
        "console": {"class": "logging.StreamHandler", "stream": "ext://sys.stdout", "formatter": "json"},
    },
    "loggers": {"desk_monitor": {"handlers": ["console"], "level": "INFO"}},
}
