"""Plan the backfill: reference solution."""
from datetime import date, timedelta


def backfill_days(first_bad_day, last_day, raw_kept_from):
    """Split first_bad_day..last_day into the days raw data can rebuild and the days it cannot."""
    first, last, kept = (date.fromisoformat(d) for d in (first_bad_day, last_day, raw_kept_from))
    days, unreachable = [], []
    d = first
    while d <= last:
        (days if d >= kept else unreachable).append(d.isoformat())
        d += timedelta(days=1)
    return days, unreachable


def tables_to_rebuild(deps, fixed):
    """The fixed table and every table built from it, upstream first, ties by name."""
    readers = {}
    for table, upstreams in deps.items():
        for up in upstreams:
            readers.setdefault(up, []).append(table)
    wanted = {fixed}
    stack = [fixed]
    while stack:
        for reader in readers.get(stack.pop(), []):
            if reader not in wanted:
                wanted.add(reader)
                stack.append(reader)
    order = []
    waiting = {t: {u for u in deps.get(t, []) if u in wanted} for t in wanted}
    while waiting:
        ready = sorted(t for t, ups in waiting.items() if not ups)
        if not ready:
            raise ValueError("the dependencies form a cycle")
        table = ready[0]
        order.append(table)
        del waiting[table]
        for ups in waiting.values():
            ups.discard(table)
    return order


def schedule(deps, fixed, days, reads_previous_day=()):
    """Group the backfill's (table, day) jobs into waves; each job runs in the first wave after all it waits for."""
    tables = tables_to_rebuild(deps, fixed)
    rebuilt = set(tables)
    wave_of = {}
    for table in tables:
        for i, day in enumerate(days):
            after = [wave_of[(up, day)] for up in deps.get(table, []) if up in rebuilt]
            if table in reads_previous_day and i > 0:
                after.append(wave_of[(table, days[i - 1])])
            wave_of[(table, day)] = max(after, default=-1) + 1
    waves = [[] for _ in range(max(wave_of.values(), default=-1) + 1)]
    for job, wave in wave_of.items():
        waves[wave].append(job)
    return [sorted(w) for w in waves]
