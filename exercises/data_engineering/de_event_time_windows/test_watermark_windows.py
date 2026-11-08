from watermark_windows import hopping_starts, run_tumbling, sessions, window_start

# The lesson's arrivals, in the order the pipeline saw them: (event_id, event_minute).
ARRIVALS = [
    ("e1", 1), ("e2", 3), ("e3", 6), ("e4", 4),
    ("e5", 8), ("e6", 2), ("e7", 9), ("e8", 12),
]


def test_window_start_tiles_time():
    assert window_start(0, 5) == 0
    assert window_start(4, 5) == 0
    assert window_start(5, 5) == 5
    assert window_start(12, 5) == 10
    assert window_start(59, 60) == 0


def test_hopping_windows_put_each_event_in_several():
    assert hopping_starts(7, 10, 5) == [0, 5]
    assert hopping_starts(5, 10, 5) == [0, 5]
    assert hopping_starts(2, 10, 5) == [-5, 0]
    assert hopping_starts(12, 15, 5) == [0, 5, 10]
    assert hopping_starts(12, 5, 5) == [10]


def test_hopping_counts_add_up_to_more_than_the_events():
    windows = [s for _, t in ARRIVALS for s in hopping_starts(t, 10, 5)]
    assert len(windows) == 2 * len(ARRIVALS)


def test_sessions_split_on_the_gap():
    assert sessions([1, 3, 20, 4], 5) == [(1, 4, 3), (20, 20, 1)]
    assert sessions([10, 2, 6], 4) == [(2, 2, 1), (6, 6, 1), (10, 10, 1)]
    assert sessions([10, 2, 6], 5) == [(2, 10, 3)]
    assert sessions([], 5) == []


def test_the_lessons_stream_counts_e6_as_late():
    emitted, late = run_tumbling(ARRIVALS, size=5, lateness=2)
    assert emitted == [(0, 3), (5, 3), (10, 1)]
    assert late == ["e6"]


def test_by_arrival_order_the_first_window_would_show_only_two():
    # The same events windowed by event time, with room for every delay: nothing is late.
    emitted, late = run_tumbling(ARRIVALS, size=5, lateness=10)
    assert emitted == [(0, 4), (5, 3), (10, 1)]
    assert late == []


def test_less_lateness_closes_windows_sooner_and_drops_more():
    emitted, late = run_tumbling(ARRIVALS, size=5, lateness=0)
    assert late == ["e4", "e6"]
    assert emitted == [(0, 2), (5, 3), (10, 1)]


def test_windows_are_emitted_as_soon_as_the_watermark_passes():
    emitted, _ = run_tumbling([("a", 1), ("b", 7), ("c", 13)], size=5, lateness=1)
    # b moves the watermark to 6, closing [0, 5); c moves it to 12, closing [5, 10).
    assert emitted == [(0, 1), (5, 1), (10, 1)]
    emitted, _ = run_tumbling([("a", 1), ("c", 13), ("b", 7)], size=5, lateness=1)
    # c closes both [0, 5) and [5, 10) before b arrives, so b is late and [5, 10) never opens.
    assert emitted == [(0, 1), (10, 1)]


def test_a_late_event_is_reported_even_for_a_window_never_opened():
    emitted, late = run_tumbling([("a", 20), ("b", 3)], size=5, lateness=2)
    assert emitted == [(20, 1)]
    assert late == ["b"]
