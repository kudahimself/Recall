import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import styles from './LivePreview.module.css';

// null = Fill (preview takes the pane's full width).
export type DevicePreset = number | null;

interface Props {
  active: DevicePreset;
  onChange: (preset: DevicePreset) => void;
  // Actual rendered width of the preview frame, for the px badge.
  renderedWidth: number | null;
  // Layout-overlay toggle (flex/grid inspector). All optional so existing
  // callers render unchanged; the button only appears when containers exist.
  overlayAvailable?: boolean;
  overlayOn?: boolean;
  onToggleOverlay?: () => void;
}

// Widths as numbers: they read the same as the px readout and the breakpoints.
const PRESETS: { label: string; width: DevicePreset; title: string }[] = [
  { label: '375', width: 375, title: 'A small phone, 375px wide' },
  { label: '667', width: 667, title: 'A phone on its side, 667px wide' },
  { label: '768', width: 768, title: 'A tablet, 768px wide' },
  { label: '1024', width: 1024, title: 'A laptop, 1024px wide' },
  { label: 'Fill', width: null, title: 'The width of this pane' },
];

// Tailwind's default breakpoint ladder - pure lookup, no Tailwind runtime.
function tailwindBreakpoint(width: number): string {
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'base';
}

export const ResponsiveDeviceToolbar: React.FC<Props> = ({
  active,
  onChange,
  renderedWidth,
  overlayAvailable,
  overlayOn,
  onToggleOverlay,
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.presets} role="group" aria-label="Preview width">
        {PRESETS.map(preset => (
          <Button
            key={preset.label}
            size="xs"
            variant="ghost"
            aria-pressed={active === preset.width}
            onClick={() => onChange(preset.width)}
            title={preset.title}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className={styles.readout}>
        {overlayAvailable && onToggleOverlay && (
          <Button
            size="xs"
            variant="ghost"
            aria-pressed={!!overlayOn}
            onClick={onToggleOverlay}
            title="Show flex/grid containers, items, tracks and gaps over the preview"
          >
            Layout
          </Button>
        )}
        {renderedWidth !== null && (
          <>
            <span className={styles.width}>{renderedWidth}px</span>
            <Badge tone="accent" title="The Tailwind breakpoint at this width">{tailwindBreakpoint(renderedWidth)}</Badge>
          </>
        )}
      </div>
    </div>
  );
};
