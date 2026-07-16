import React from 'react';
import { MediaRuleStatus } from '../../utils/frameInspector';
import './MediaRuleChips.css';

interface Props {
  // Parent hides the strip entirely when there are no rules.
  rules: MediaRuleStatus[];
}

// Shows each @media condition in the learner's CSS as active or inactive at
// the preview's current width - drag through device presets to watch them flip.
export const MediaRuleChips: React.FC<Props> = ({ rules }) => {
  return (
    <div className="media-rule-chips" title="@media rules in your CSS - lit when active at the preview's current width">
      <span className="media-rule-chips-label">@media</span>
      {rules.map(rule => (
        <span
          key={rule.condition}
          className={`media-rule-chip${rule.active ? ' media-rule-chip-active' : ''}`}
        >
          {rule.condition}
        </span>
      ))}
    </div>
  );
};
