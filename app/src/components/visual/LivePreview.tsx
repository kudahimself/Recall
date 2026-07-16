import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildPreviewDoc } from '../../utils/previewDoc';
import { ResponsiveDeviceToolbar, DevicePreset } from './ResponsiveDeviceToolbar';
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
  const paneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  const handleFrameLoad = () => {
    try {
      setDocTitle(frameRef.current?.contentDocument?.title ?? '');
    } catch {
      setDocTitle('');
    }
  };

  // Track the frame's actual rendered width (preset may exceed the pane, in
  // which case the pane scrolls horizontally and the frame keeps preset width;
  // Fill tracks the pane itself).
  useEffect(() => {
    const measure = () => {
      const frame = frameRef.current;
      if (frame) setRenderedWidth(Math.round(frame.getBoundingClientRect().width));
    };
    measure();
    const pane = paneRef.current;
    if (!pane || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(pane);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [preset]);

  return (
    <div className="live-preview">
      <ResponsiveDeviceToolbar active={preset} onChange={setPreset} renderedWidth={renderedWidth} />
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
