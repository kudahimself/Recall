const fs = require('fs');
const path = require('path');

const files = [
  'webdevOrderedQuestions.ts',
  'projectQuestions.ts',
  'formsTestingQuestions.ts',
  'a11yShadcnQuestions.ts',
  'prismaQuestions.ts',
  'htmlCssQuestions.ts',
  'webdevGapQuestions.ts',
  'webdevAdvancedQuestions.ts',
  'webdevQuestions.ts',
  'securityQuestions.ts',
  'nextjsQuestions.ts',
  'designPatternQuestions.ts',
  'advancedNextQuestions.ts'
];

const results = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all question objects
  const questionRegex = /\{\s*id:\s*'([^']+)'[^}]*?type:\s*QuestionType\.CODING[^}]*?course:\s*Course\.WEB_DEV[^}]*?\}/gms;
  let match;
  
  while ((match = questionRegex.exec(content)) !== null) {
    const fullQuestion = match[0];
    const id = match[1];
    
    // Extract starterCode
    const starterMatch = fullQuestion.match(/starterCode:\s*`([^`]+)`/);
    const starter = starterMatch ? starterMatch[1] : '';
    
    // Extract question text
    const qMatch = fullQuestion.match(/question:\s*'([^']*(?:'[^']*'[^']*)*)'|question:\s*`([^`]*)`/);
    const question = qMatch ? (qMatch[1] || qMatch[2]) : '';
    
    results.push({
      file,
      id,
      starterCode: starter,
      question: question.substring(0, 200)
    });
  }
});

console.log(JSON.stringify(results, null, 2));
