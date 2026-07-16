import React from 'react';
import './ResponsiveDeviceToolbar.css';

// null = Fill (preview takes the pane's full width).
export type DevicePreset = number | null;

interface Props {
  active: DevicePreset;
  onChange: (preset: DevicePreset) => void;
  // Actual rendered width of the preview frame, for the px badge.
  renderedWidth: number | null;
  // Layout-overlay toggle (flex/grid inspector). All optional so existing
  // callers render unchanged; the pill only appears when containers exist.
  overlayAvailable?: boolean;
  overlayOn?: boolean;
  onToggleOverlay?: () => void;
}

const PRESETS: { label: string; width: DevicePreset }[] = [
  { label: 'SE', width: 375 },
  { label: 'Phone', width: 667 },
  { label: 'Tablet', width: 768 },
  { label: 'Laptop', width: 1024 },
  { label: 'Fill', width: null },
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
    <div className="device-toolbar">
      <div className="device-toolbar-presets">
        {PRESETS.map(preset => (
          <button
            key={preset.label}
            type="button"
            className={`device-preset${active === preset.width ? ' device-preset-active' : ''}`}
            onClick={() => onChange(preset.width)}
            title={preset.width ? `${preset.width}px` : 'Fill available width'}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="device-toolbar-readout">
        {overlayAvailable && onToggleOverlay && (
          <button
            type="button"
            className={`device-preset${overlayOn ? ' device-preset-active' : ''}`}
            onClick={onToggleOverlay}
            title="Show flex/grid containers, items, tracks and gaps over the preview"
          >
            Layout
          </button>
        )}
        {renderedWidth !== null && (
          <>
            <span className="device-width-badge">{renderedWidth}px</span>
            <span className="device-breakpoint-pill">{tailwindBreakpoint(renderedWidth)}</span>
          </>
        )}
      </div>
    </div>
  );
};
