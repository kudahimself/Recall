import React, { useState, useMemo } from 'react';
import { Topic, Difficulty, QuestionType, Course } from '../types';
import { getCourseForTopic, DATABRICKS_SECTIONS, WEBDEV_SECTIONS, BACKEND_SECTIONS, DATA_ENG_SECTIONS, SQL_SECTIONS } from '../utils/courseConfig';
import './QuestionFilter.css';

interface FilterOptions {
  topics: Topic[];
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
}

interface Props {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
  activeCourse: Course;
}

export const QuestionFilter: React.FC<Props> = ({ filters, onFilterChange, onReset, activeCourse }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const allDifficulties = Object.values(Difficulty);
  const allQuestionTypes = Object.values(QuestionType);

  const examSections = activeCourse === Course.DATABRICKS
    ? DATABRICKS_SECTIONS
    : activeCourse === Course.WEB_DEV
    ? WEBDEV_SECTIONS
    : activeCourse === Course.DATA_ENGINEERING
    ? DATA_ENG_SECTIONS
    : activeCourse === Course.SQL
    ? SQL_SECTIONS
    : BACKEND_SECTIONS;

  // All topic keys for this course (flattened from sections)
  const allCourseTopics = useMemo(() => {
    const topics: Topic[] = [];
    for (const section of Object.values(examSections)) {
      for (const topicKeys of Object.values(section.topics)) {
        for (const key of topicKeys) {
          if (!topics.includes(key as Topic)) {
            topics.push(key as Topic);
          }
        }
      }
    }
    return topics;
  }, [examSections]);

  const toggleSection = (sectionName: string) => {
    const next = new Set(expandedSections);
    if (next.has(sectionName)) {
      next.delete(sectionName);
    } else {
      next.add(sectionName);
    }
    setExpandedSections(next);
  };

  const handleTopicToggle = (topicKey: string) => {
    const topic = topicKey as Topic;
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];
    onFilterChange({ ...filters, topics: newTopics });
  };

  const handleSectionToggle = (sectionName: string) => {
    const section = examSections[sectionName];
    if (!section) return;
    const sectionTopics = Object.values(section.topics).flat() as Topic[];
    const allSelected = sectionTopics.every(t => filters.topics.includes(t));

    let newTopics: Topic[];
    if (allSelected) {
      // Deselect all topics in this section
      newTopics = filters.topics.filter(t => !sectionTopics.includes(t));
    } else {
      // Select all topics in this section
      const toAdd = sectionTopics.filter(t => !filters.topics.includes(t));
      newTopics = [...filters.topics, ...toAdd];
    }
    onFilterChange({ ...filters, topics: newTopics });
  };

  const handleDifficultyToggle = (difficulty: Difficulty) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    onFilterChange({ ...filters, difficulties: newDifficulties });
  };

  const handleQuestionTypeToggle = (type: QuestionType) => {
    const newTypes = filters.questionTypes.includes(type)
      ? filters.questionTypes.filter(t => t !== type)
      : [...filters.questionTypes, type];
    onFilterChange({ ...filters, questionTypes: newTypes });
  };

  const allTopicsSelected = allCourseTopics.every(t => filters.topics.includes(t));
  const allDifficultiesSelected = allDifficulties.every(d => filters.difficulties.includes(d));

  const toggleAllTopics = () => {
    onFilterChange({ ...filters, topics: allTopicsSelected ? [] : [...allCourseTopics] });
  };

  const toggleAllDifficulties = () => {
    onFilterChange({ ...filters, difficulties: allDifficultiesSelected ? [] : [...allDifficulties] });
  };

  const isSectionFullySelected = (sectionName: string) => {
    const section = examSections[sectionName];
    if (!section) return false;
    const sectionTopics = Object.values(section.topics).flat();
    return sectionTopics.every(t => filters.topics.includes(t as Topic));
  };

  const isSectionPartiallySelected = (sectionName: string) => {
    const section = examSections[sectionName];
    if (!section) return false;
    const sectionTopics = Object.values(section.topics).flat();
    const selectedCount = sectionTopics.filter(t => filters.topics.includes(t as Topic)).length;
    return selectedCount > 0 && selectedCount < sectionTopics.length;
  };

  return (
    <div className="question-filter">
      <div className="filter-header">
        <h3>Filter Questions</h3>
        <button className="reset-filters-btn" onClick={onReset}>
          Reset All
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-section-header">
          <h4>Topics</h4>
          <button className="select-all-btn" onClick={toggleAllTopics}>
            {allTopicsSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="filter-exam-sections">
          {Object.entries(examSections).map(([sectionName, section]) => {
            const isExpanded = expandedSections.has(sectionName);
            const fullySelected = isSectionFullySelected(sectionName);
            const partiallySelected = isSectionPartiallySelected(sectionName);

            return (
              <div key={sectionName} className="filter-section-group">
                <div className="filter-section-row">
                  <button
                    type="button"
                    className="filter-section-expand"
                    onClick={() => toggleSection(sectionName)}
                    aria-expanded={isExpanded}
                  >
                    <span className="category-icon">{isExpanded ? '▼' : '▶'}</span>
                    <span className="filter-section-name">{sectionName}</span>
                    {section.weight && (
                      <span className="filter-weight-badge">{section.weight}</span>
                    )}
                  </button>
                  <button
                    className={`filter-section-toggle ${fullySelected ? 'active' : ''} ${partiallySelected ? 'partial' : ''}`}
                    onClick={() => handleSectionToggle(sectionName)}
                    title={fullySelected ? 'Deselect all in section' : 'Select all in section'}
                  >
                    {fullySelected ? '✓' : partiallySelected ? '−' : ''}
                  </button>
                </div>

                {isExpanded && (
                  <div className="filter-section-topics">
                    {Object.entries(section.topics).map(([topicName, topicKeys]) => {
                      const allActive = topicKeys.every(k => filters.topics.includes(k as Topic));
                      const anyActive = topicKeys.some(k => filters.topics.includes(k as Topic));
                      const handleClick = () => {
                        let newTopics: Topic[];
                        if (allActive) {
                          newTopics = filters.topics.filter(t => !topicKeys.includes(t));
                        } else {
                          const toAdd = topicKeys.filter(k => !filters.topics.includes(k as Topic)) as Topic[];
                          newTopics = [...filters.topics, ...toAdd];
                        }
                        onFilterChange({ ...filters, topics: newTopics });
                      };
                      return (
                        <button
                          key={topicName}
                          type="button"
                          className={`filter-topic-item ${allActive ? 'active' : anyActive ? 'partial' : ''}`}
                          onClick={handleClick}
                          aria-pressed={allActive}
                        >
                          <span className="filter-topic-check">{allActive ? '✓' : anyActive ? '−' : ''}</span>
                          <span className="filter-topic-name">{topicName}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-section filter-inline">
          <div className="filter-section-header">
            <h4>Difficulty</h4>
            <button className="select-all-btn" onClick={toggleAllDifficulties}>
              {allDifficultiesSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="filter-chips">
            {allDifficulties.map(difficulty => (
              <button
                key={difficulty}
                className={`filter-chip difficulty-${difficulty} ${
                  filters.difficulties.includes(difficulty) ? 'active' : ''
                }`}
                onClick={() => handleDifficultyToggle(difficulty)}
              >
                <span className="chip-label">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section filter-inline">
          <div className="filter-section-header">
            <h4>Question Type</h4>
          </div>
          <div className="filter-chips">
            {allQuestionTypes.map(type => (
              <button
                key={type}
                className={`filter-chip ${filters.questionTypes.includes(type) ? 'active' : ''}`}
                onClick={() => handleQuestionTypeToggle(type)}
              >
                <span className="chip-label">
                  {type === QuestionType.MULTIPLE_CHOICE
                    ? 'Multiple Choice'
                    : type === QuestionType.PARSONS
                    ? 'Parsons'
                    : type === QuestionType.PREDICT_OUTPUT
                    ? 'Predict Output'
                    : type === QuestionType.CLOZE_CODE
                    ? 'Fill Blanks'
                    : 'Coding'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
