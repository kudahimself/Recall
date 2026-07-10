# Databricks Learning Platform

An interactive learning platform for mastering Databricks, PySpark, and Spark SQL through spaced repetition and progressive difficulty.

## Features

- **Spaced Repetition Learning**: Questions repeat at optimal intervals based on your performance
- **Progressive Difficulty**: Start with beginner concepts and advance to expert-level topics
- **Dual Question Types**:
  - Multiple choice questions for conceptual knowledge
  - Coding challenges with Monaco editor for hands-on practice
- **Comprehensive Coverage**: 294 questions covering:
  - Databricks fundamentals
  - PySpark basics and DataFrames
  - Transformations and Actions
  - Spark SQL queries
  - Advanced topics (window functions, optimization, caching)
- **Progress Tracking**: Detailed statistics by topic and difficulty level
- **Persistent Progress**: Your learning progress is automatically saved
- **Smart Validation**: Client-side code validation that catches common PySpark/SQL mistakes
- **No Backend Required**: Fully runs in the browser

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation and Running

```bash
# Install dependencies (if not already installed)
npm install

# Start the development server
npm start
```

The application will open in your browser at `http://localhost:3000`

### Other Available Scripts

#### `npm test`
Launches the test runner in the interactive watch mode.

#### `npm run build`
Builds the app for production to the `build` folder.

## Usage

1. **Home Page**: View your overall progress and learning statistics
2. **Practice Mode**: Answer questions selected by the spaced repetition algorithm
3. **Progress View**: Track your performance across topics and difficulty levels

### Tips for Learning

- Answer questions honestly - the algorithm adapts to your actual knowledge
- Review explanations carefully, even for correct answers
- Use hints sparingly to challenge yourself
- Practice regularly - the spaced repetition works best with consistent sessions
- Focus on understanding concepts, not just memorizing answers

## Project Structure

```
src/
├── components/          # React components
│   ├── MultipleChoiceQuestion.tsx
│   ├── CodingQuestion.tsx
│   └── ProgressTracker.tsx
├── data/               # Question bank
│   └── questions.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── spacedRepetition.ts
├── App.tsx             # Main application component
└── App.css             # Application styles
```

## Technologies

- React 18 with TypeScript
- Monaco Editor for code editing
- Local Storage for progress persistence
- CSS3 for styling

## Smart Code Validation

The app uses sophisticated client-side validation to check your code without needing a backend:

**Pattern Matching:**
- Validates code structure and method chains
- Normalizes whitespace, quotes, and formatting differences

**Error Detection:**
- Catches `.then()` instead of PySpark's `.otherwise()`
- Detects `.else()` instead of `.otherwise()`
- Identifies incorrect `when()` usage with string literals
- Validates SQL keyword presence and structure

**Semantic Analysis:**
- Accepts semantically equivalent solutions (e.g., `filter()` vs `where()`)
- Compares method chains and parameters
- Provides helpful, actionable error messages

## Spaced Repetition Algorithm

The platform uses an intelligent spaced repetition system that:
- Prioritizes new questions you haven't seen
- Repeats incorrect answers more frequently
- Spaces out correctly answered questions (1, 3, 7, 14, 30 days)
- Adapts to your performance in real-time

## Contributing

To add new questions, edit `src/data/questions.ts` following the existing format:

```typescript
{
  id: 'unique-id',
  type: QuestionType.MULTIPLE_CHOICE, // or CODING
  difficulty: Difficulty.BEGINNER, // or INTERMEDIATE, ADVANCED
  topic: Topic.PYSPARK_BASICS,
  question: 'Your question here',
  // ... additional fields based on question type
}
```

## Support

For issues or questions, please refer to the Databricks documentation:
- [Databricks Documentation](https://docs.databricks.com/)
- [PySpark Documentation](https://spark.apache.org/docs/latest/api/python/)
- [Spark SQL Guide](https://spark.apache.org/docs/latest/sql-programming-guide.html)
