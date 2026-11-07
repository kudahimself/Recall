import { Course, MisconceptionStore, Question, UserProgress } from '../../types';
import { CoursePath } from '../../utils/coursePath';
import { ExercisesDone } from '../../utils/exercises';
import { HeatmapDay } from '../ui/Heatmap';

export type ProgressTab = 'overview' | 'topics' | 'schedule';

export interface ProgressViewProps {
  course: Course;
  /** The active course's questions. */
  questions: Question[];
  progress: UserProgress;
  path: CoursePath;
  misconceptions: MisconceptionStore;
  activity: HeatmapDay[];
  exercisesDone: ExercisesDone;
  longestStreak: number;
  tab: ProgressTab;
  onTabChange: (tab: ProgressTab) => void;
  /** The topic selected on the Topics tab (a unit key), kept while the learner drills and comes back. */
  topic: string | null;
  onTopicChange: (unitKey: string) => void;
  onDrill: (topicKeys: string[]) => void;
  onRuleCard: (lessonId: string) => void;
  onStartLesson: (lessonId: string) => void;
  onToggleExercise: (exerciseId: string) => void;
}

/** A unit's key in the lists: its topic keys, unique in a course. */
export const unitKey = (topicKeys: string[]) => topicKeys.join('+');

