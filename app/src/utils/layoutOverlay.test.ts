import { parseTrackList } from './layoutOverlay';

// Pure string parsing of computed grid-template values - the only part of the
// overlay that is jsdom-testable (drawing needs a real layout engine).

describe('parseTrackList', () => {
  it('parses a resolved px track list', () => {
    expect(parseTrackList('100px 240px 100px')).toEqual([100, 240, 100]);
  });

  it('handles fractional px values', () => {
    expect(parseTrackList('133.333px 133.333px')).toEqual([133.333, 133.333]);
  });

  it('returns [] for none', () => {
    expect(parseTrackList('none')).toEqual([]);
  });

  it('returns [] for an empty string', () => {
    expect(parseTrackList('')).toEqual([]);
  });

  it('ignores non-px tokens', () => {
    expect(parseTrackList('100px auto 50px')).toEqual([100, 50]);
  });
});
