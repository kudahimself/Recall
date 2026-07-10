import React from 'react';
import { Home, BookOpen, TrendingUp, Database, Globe, Server, Network, Table2 } from 'lucide-react';
import { Course } from '../types';
import './NavigationRail.css';

interface NavigationRailProps {
  activeView: 'quiz' | 'progress' | 'home' | 'filter';
  activeCourse: Course;
  onViewChange: (view: 'quiz' | 'progress' | 'home') => void;
  onCourseChange: (course: Course) => void;
  collapsed: boolean;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeView,
  activeCourse,
  onViewChange,
  onCourseChange,
  collapsed,
}) => {
  const viewIcons = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'quiz' as const, icon: BookOpen, label: 'Learn' },
    { id: 'progress' as const, icon: TrendingUp, label: 'Progress' },
  ];

  const courseIcons = [
    { id: Course.DATABRICKS, icon: Database, label: 'Databricks & PySpark', color: 'var(--databricks-solid)' },
    { id: Course.WEB_DEV, icon: Globe, label: 'Web Development', color: 'var(--webdev-solid)' },
    { id: Course.BACKEND, icon: Server, label: 'Backend Engineering', color: 'var(--backend-solid)' },
    { id: Course.DATA_ENGINEERING, icon: Network, label: 'Data Engineering', color: 'var(--dataeng-solid)' },
    { id: Course.SQL, icon: Table2, label: 'SQL for Data Engineering', color: 'var(--sql-solid)' },
  ];

  return (
    <nav className={`navigation-rail ${collapsed ? 'collapsed' : ''}`} aria-label="Main navigation">
      {/* View Navigation */}
      <div className="nav-section nav-views">
        {viewIcons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`nav-item ${activeView === id ? 'active' : ''}`}
            onClick={() => onViewChange(id)}
            title={label}
            aria-label={label}
            aria-current={activeView === id ? 'page' : undefined}
          >
            <Icon size={20} />
            {!collapsed && <span className="nav-label">{label}</span>}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="nav-divider" />

      {/* Course Selection */}
      <div className="nav-section nav-courses">
        {courseIcons.map(({ id, icon: Icon, label, color }) => (
          <button
            key={id}
            className={`nav-item nav-course ${activeCourse === id ? 'active' : ''}`}
            onClick={() => onCourseChange(id)}
            title={label}
            aria-label={label}
            aria-current={activeCourse === id ? 'true' : undefined}
            style={activeCourse === id ? { '--course-color': color } as React.CSSProperties : undefined}
          >
            <Icon size={20} />
            {!collapsed && <span className="nav-label">{label}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
};
