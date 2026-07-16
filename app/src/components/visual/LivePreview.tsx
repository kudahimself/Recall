import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildPreviewDoc } from '../../utils/previewDoc';
import { readMediaRules, detectLayoutContainers, MediaRuleStatus } from '../../utils/frameInspector';
import { renderLayoutOverlay, clearLayoutOverlay } from '../../utils/layoutOverlay';
import { ResponsiveDeviceToolbar, DevicePreset } from './ResponsiveDeviceToolbar';
import { MediaRuleChips } from './MediaRuleChips';
import './LivePreview.css';

interface Props {
  // Markup rendered in the frame. For CSS questions this is the question's
  // previewHtml; for HTML questions it is the learner's code itself.
  html: string;
  // Learner CSS (undefined for HTML questions - their code is the html prop).
  css?: string;
  // Load the Tailwind Play CDN inside the frame (TAILWIND-topic questions).
  // This is the only case where the sandbox allows scripts.
  tailwind?: boolean;
}

const DEBOUNCE_MS = 300;
// Tailwind's JIT applies styles after load - re-inspect once so the overlay
// toggle and media chips catch up.
const TAILWIND_REINSPECT_MS = 500;

export const LivePreview: React.FC<Props> = ({ html, css, tailwind }) => {
  // Debounce the srcDoc rebuild so the iframe doesn't reload on every keystroke.
  const [debounced, setDebounced] = useState({ html, css, tailwind });
  useEffect(() => {
    const timer = setTimeout(() => setDebounced({ html, css, tailwind }), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [html, css, tailwind]);

  const srcDoc = useMemo(() => buildPreviewDoc(debounced), [debounced]);

  const [preset, setPreset] = useState<DevicePreset>(null);
  const [renderedWidth, setRenderedWidth] = useState<number | null>(null);
  // The frame document's <title>, surfaced as a fake browser tab - otherwise
  // metadata/head questions have no visible effect at all.
  const [docTitle, setDocTitle] = useState('');
  // Inspector state: @media chips + flex/grid overlay toggle.
  const [mediaRules, setMediaRules] = useState<MediaRuleStatus[]>([]);
  const [hasLayoutContainers, setHasLayoutContainers] = useState(false);
  const [overlayOn, setOverlayOn] = useState(false);
  const paneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const reinspectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasLearnerCss = Boolean(debounced.css);

  // Re-reads the frame document: @media activity at the current frame width,
  // layout-container detection, and the overlay (re)draw. Called after every
  // frame load (srcDoc replaced the whole document) and on every resize
  // (matchMedia flips, rects move). frameInspector degrades to [] on failure.
  const inspectFrame = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    const win = frameRef.current?.contentWindow;
    if (!doc || !win) return;
    setMediaRules(hasLearnerCss ? readMediaRules(doc, win) : []);
    const containersFound = detectLayoutContainers(doc, win).length > 0;
    setHasLayoutContainers(containersFound);
    if (overlayOn && containersFound) {
      renderLayoutOverlay(doc, win);
    } else {
      clearLayoutOverlay(doc);
    }
  }, [hasLearnerCss, overlayOn]);

  const handleFrameLoad = () => {
    try {
      setDocTitle(frameRef.current?.contentDocument?.title ?? '');
    } catch {
      setDocTitle('');
    }
    inspectFrame();
    if (reinspectTimer.current) clearTimeout(reinspectTimer.current);
    if (debounced.tailwind) {
      reinspectTimer.current = setTimeout(inspectFrame, TAILWIND_REINSPECT_MS);
    }
  };

  useEffect(() => () => {
    if (reinspectTimer.current) clearTimeout(reinspectTimer.current);
  }, []);

  // Draw/clear immediately when the toggle flips, without waiting for a
  // resize or reload.
  useEffect(() => {
    inspectFrame();
  }, [inspectFrame]);

  // Track the frame's actual rendered width (preset may exceed the pane, in
  // which case the pane scrolls horizontally and the frame keeps preset width;
  // Fill tracks the pane itself).
  useEffect(() => {
    const measure = () => {
      const frame = frameRef.current;
      if (frame) setRenderedWidth(Math.round(frame.getBoundingClientRect().width));
      inspectFrame();
    };
    measure();
    const pane = paneRef.current;
    if (!pane || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(pane);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [preset, inspectFrame]);

  return (
    <div className="live-preview">
      <ResponsiveDeviceToolbar
        active={preset}
        onChange={setPreset}
        renderedWidth={renderedWidth}
        overlayAvailable={hasLayoutContainers}
        overlayOn={overlayOn}
        onToggleOverlay={() => setOverlayOn(on => !on)}
      />
      {mediaRules.length > 0 && <MediaRuleChips rules={mediaRules} />}
      {docTitle && (
        <div className="live-preview-tab" title="The document's <title> - what the browser tab would show">
          <span className="live-preview-tab-dot" />
          <span className="live-preview-tab-text">{docTitle}</span>
        </div>
      )}
      <div className="live-preview-pane" ref={paneRef}>
        <iframe
          ref={frameRef}
          className="live-preview-frame"
          title="Live preview of your code"
          sandbox={debounced.tailwind ? 'allow-same-origin allow-scripts' : 'allow-same-origin'}
          srcDoc={srcDoc}
          onLoad={handleFrameLoad}
          style={preset !== null ? { width: `${preset}px`, flex: '0 0 auto' } : undefined}
        />
      </div>
    </div>
  );
};
