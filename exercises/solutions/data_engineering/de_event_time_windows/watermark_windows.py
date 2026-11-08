"""Windows that close on time: reference solution."""


def window_start(event_time, size):
    """The start of the tumbling window of length size that holds event_time."""
    return event_time // size * size


def hopping_starts(event_time, size, step):
    """The starts of every hopping window (length size, a new one every step) that holds event_time."""
    first = (event_time - size) // step * step + step
    return list(range(first, event_time + 1, step))


def sessions(times, gap):
    """Split event times into sessions: (first, last, events) for each, in time order."""
    result = []
    for t in sorted(times):
        if result and t - result[-1][1] < gap:
            first, _, count = result[-1]
            result[-1] = (first, t, count + 1)
        else:
            result.append((t, t, 1))
    return result


def run_tumbling(arrivals, size, lateness):
    """Count events per tumbling window by event time, closing windows with a watermark."""
    counts = {}
    emitted, late = [], []
    newest = None
    for event_id, event_time in arrivals:
        start = window_start(event_time, size)
        watermark = None if newest is None else newest - lateness
        if watermark is not None and watermark >= start + size:
            late.append(event_id)
        else:
            counts[start] = counts.get(start, 0) + 1
        newest = event_time if newest is None else max(newest, event_time)
        watermark = newest - lateness
        for s in sorted(counts):
            if s + size <= watermark:
                emitted.append((s, counts.pop(s)))
    for s in sorted(counts):
        emitted.append((s, counts[s]))
    return emitted, late
