# Windows that close on time

Topic: Event Time, Windows & Watermarks (Data Engineering, Streaming).
Time: about 25 minutes.

## Task

A ride app streams trip events, and phones that lose signal send theirs late and out of order.
The dashboard counts events per 5-minute window by when they happened, not by when they arrived, and has to decide when a window is complete.
Fill in the four functions in `watermark_windows.py`:

- `window_start(event_time, size)` finds an event's tumbling window.
- `hopping_starts(event_time, size, step)` lists the hopping windows an event falls in.
- `sessions(times, gap)` splits activity into sessions wherever it pauses for `gap` minutes or more.
- `run_tumbling(arrivals, size, lateness)` plays a stream through tumbling windows closed by a watermark, and sends events for closed windows to a late output.

Plain Python: no streaming engine, just the bookkeeping one does for you.

## Examples

With the lesson's arrivals (e6 happened at minute 2 but arrived at minute 10):

```python
window_start(12, 5)                     # 10
hopping_starts(7, 10, 5)                # [0, 5]
sessions([1, 3, 20, 4], 5)              # [(1, 4, 3), (20, 20, 1)]
run_tumbling(ARRIVALS, size=5, lateness=2)
# ([(0, 3), (5, 3), (10, 1)], ["e6"])
run_tumbling(ARRIVALS, size=5, lateness=10)
# ([(0, 4), (5, 3), (10, 1)], []): complete, but nothing emitted until the end
```

Watch for the lesson's pitfall: windowing by arrival time.
Nothing is ever late that way, which looks simpler, but an offline phone's events land in the window they were uploaded in, and a replay of the same data gives other numbers.
The watermark is the newest event time seen minus the allowed lateness: more lateness gives more complete windows, later, with more of them held open.

## Run the tests

```bash
cd exercises/data_engineering/de_event_time_windows
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
