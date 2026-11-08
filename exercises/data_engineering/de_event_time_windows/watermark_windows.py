"""Windows that close on time: window events by event time and close windows with a watermark.

Times are whole minutes (minute 0 is 10:00).
An arrival is an (event_id, event_time) pair, and a stream is a list of arrivals in the
order the pipeline saw them.
Fill in each function so the tests in test_watermark_windows.py pass.
Run them from this folder with: pytest
"""


def window_start(event_time, size):
    """The start of the tumbling window of length size that holds event_time.

    Windows are [0, size), [size, 2 * size), ... so window_start(7, 5) -> 5.
    """
    # TODO
    raise NotImplementedError


def hopping_starts(event_time, size, step):
    """The starts of every hopping window (length size, a new one every step) that holds event_time.

    Windows start at every multiple of step, negative ones included, and [start, start + size)
    holds the event. Return the starts in order.
    hopping_starts(7, 10, 5) -> [0, 5]
    """
    # TODO
    raise NotImplementedError


def sessions(times, gap):
    """Split event times into sessions: (first, last, events) for each, in time order.

    The times may come in any order.
    A session goes on while the next event comes less than gap minutes after the one before.
    sessions([1, 3, 20, 4], 5) -> [(1, 4, 3), (20, 20, 1)]
    """
    # TODO
    raise NotImplementedError


def run_tumbling(arrivals, size, lateness):
    """Count events per tumbling window by event time, closing windows with a watermark.

    Take the arrivals in order.
    When an event arrives, the watermark is the newest event time seen before it minus lateness
    (there is none before the first event).
    If the watermark has reached the end of the event's window (watermark >= start + size),
    the window is closed and the event goes to the late output; otherwise it is counted.
    Then, with the watermark updated to include this event, emit every open window whose end
    the watermark has reached, in start order, and drop its count.
    When the arrivals run out, emit the windows still open, in start order.
    Return (emitted, late): emitted is a list of (window_start, count) in the order emitted,
    late a list of event ids in arrival order.
    """
    # TODO
    raise NotImplementedError
