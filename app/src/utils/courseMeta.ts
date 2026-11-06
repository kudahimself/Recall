/**
 * How each course presents itself: its name, short name, icon and the theme
 * class that sets its marker hue (--course in styles/tokens.css). The hue
 * tints dots and icons only; buttons keep the brand fill in every course.
 */
import { Database, Globe, LucideIcon, Network, Server, Table2 } from 'lucide-react';
import { Course } from '../types';

export interface CourseMeta {
  label: string;
  short: string;
  Icon: LucideIcon;
  theme: string;
}

export const COURSE_META: Record<Course, CourseMeta> = {
  [Course.DATABRICKS]: { label: 'Databricks & PySpark', short: 'Databricks', Icon: Database, theme: 'theme-databricks' },
  [Course.WEB_DEV]: { label: 'Web Development', short: 'Web Dev', Icon: Globe, theme: 'theme-webdev' },
  [Course.BACKEND]: { label: 'Backend Engineering', short: 'Backend', Icon: Server, theme: 'theme-backend' },
  [Course.DATA_ENGINEERING]: { label: 'Data Engineering', short: 'Data Eng', Icon: Network, theme: 'theme-dataeng' },
  [Course.SQL]: { label: 'SQL for Data Engineering', short: 'SQL', Icon: Table2, theme: 'theme-sql' },
};

/** The courses in the order the switcher lists them (and number keys pick them). */
export const COURSE_ORDER: Course[] = [Course.DATABRICKS, Course.WEB_DEV, Course.BACKEND, Course.DATA_ENGINEERING, Course.SQL];
