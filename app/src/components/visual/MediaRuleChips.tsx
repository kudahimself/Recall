import React from 'react';
import { MediaRuleStatus } from '../../utils/frameInspector';
import { Badge } from '../ui/Badge';
import styles from './LivePreview.module.css';

interface Props {
  // Parent hides the strip entirely when there are no rules.
  rules: MediaRuleStatus[];
}

// Shows each @media condition in the learner's CSS as active or inactive at
// the preview's current width - switch widths to watch them flip.
export const MediaRuleChips: React.FC<Props> = ({ rules }) => {
  return (
    <div className={styles.media} title="@media rules in your CSS - lit when active at the preview's current width">
      <span className={styles.mediaLabel}>@media</span>
      {rules.map(rule => (
        <Badge key={rule.condition} tone={rule.active ? 'accent' : 'neutral'}>
          <span className="sr-only">{rule.active ? 'active: ' : 'inactive: '}</span>
          {rule.condition}
        </Badge>
      ))}
    </div>
  );
};
