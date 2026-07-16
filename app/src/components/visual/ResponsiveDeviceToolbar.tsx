import React from 'react';
import './ResponsiveDeviceToolbar.css';

// null = Fill (preview takes the pane's full width).
export type DevicePreset = number | null;

interface Props {
  active: DevicePreset;
  onChange: (preset: DevicePreset) => void;
  // Actual rendered width of the preview frame, for the px badge.
  renderedWidth: number | null;
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

export const ResponsiveDeviceToolbar: React.FC<Props> = ({ active, onChange, renderedWidth }) => {
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
      {renderedWidth !== null && (
        <div className="device-toolbar-readout">
          <span className="device-width-badge">{renderedWidth}px</span>
          <span className="device-breakpoint-pill">{tailwindBreakpoint(renderedWidth)}</span>
        </div>
      )}
    </div>
  );
};
