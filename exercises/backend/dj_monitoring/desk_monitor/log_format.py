"""Structured logging: a JSON formatter and the LOGGING setting that uses it."""
import json  # noqa: F401
import logging

# Every record has these attributes; any other attribute came from extra=.
BUILT_IN = set(vars(logging.makeLogRecord({}))) | {"message", "asctime"}


class JsonFormatter(logging.Formatter):
    def format(self, record):
        """One JSON object per record, on one line.

        Keys: "level" (the level name), "logger" (the logger's name), "msg" (the message
        with its arguments filled in), then every field the call passed in extra=.
        When the record carries an exception, also "error" (the exception class's name)
        and "traceback" (the formatted traceback).
        """
        # TODO
        raise NotImplementedError


# TODO: the dictConfig dict Django reads from the LOGGING setting:
# a "json" formatter made by JsonFormatter, a "console" handler writing to standard output
# with it, and the "desk_monitor" logger sending INFO and up to that handler,
# leaving loggers that already exist switched on.
LOGGING = {}
