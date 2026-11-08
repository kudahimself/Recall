/**
 * Every lesson, in course order. One file per course; a course's lessons are
 * written one section per PR, from the course's first topic on, in this course
 * order: SQL for Data Engineering, then Backend (Python), then Databricks,
 * then Web Dev; Data Engineering lessons arrive section by section with its
 * rewrite.
 * `/write-lesson` drafts a lesson; scripts/check-lessons.js checks them all.
 */
import { TopicLesson } from '../../types';
import { sqlLessons } from './sqlLessons';
import { pythonLessons } from './pythonLessons';
import { databricksLessons } from './databricksLessons';
import { dataEngineeringLessons } from './dataEngineeringLessons';
import { webdevLessons } from './webdevLessons';

export const LESSONS: TopicLesson[] = [...sqlLessons, ...pythonLessons, ...databricksLessons, ...webdevLessons, ...dataEngineeringLessons];
