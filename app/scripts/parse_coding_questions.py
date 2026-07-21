import os
import glob
import re
import json

data_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
files = sorted(glob.glob(os.path.join(data_dir, '*.ts')))

coding_questions = []

for filepath in files:
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into question blocks by looking for `id:` followed by quote
    # We find all positions of `id:` that start a question object
    # Standard format: { id: '...' or id: "..."
    # We match question blocks
    q_matches = list(re.finditer(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"]', content))
    
    for idx, match in enumerate(q_matches):
        start_pos = match.start()
        end_pos = q_matches[idx + 1].start() if idx + 1 < len(q_matches) else len(content)
        block = content[start_pos:end_pos]

        # Check if type is CODING (could be QuestionType.CODING or 'CODING' or "CODING")
        if not re.search(r'type:\s*(?:QuestionType\.)?[\'"]?CODING[\'"]?', block):
            continue

        q_id = match.group(1)
        
        # Difficulty
        diff_match = re.search(r'difficulty:\s*(?:Difficulty\.)?([A-Z_]+)', block)
        difficulty = diff_match.group(1) if diff_match else 'UNKNOWN'

        # Topic
        topic_match = re.search(r'topic:\s*(?:Topic\.)?([A-Z0-9_]+)', block)
        topic = topic_match.group(1) if topic_match else 'UNKNOWN'

        # Has tieredHints
        has_hints = 'tieredHints:' in block

        coding_questions.append({
            'id': q_id,
            'difficulty': difficulty,
            'topic': topic,
            'file': filename,
            'has_hints': has_hints
        })

print(f"Total CODING questions found: {len(coding_questions)}")
hints_count = sum(1 for q in coding_questions if q['has_hints'])
print(f"CODING questions with tieredHints: {hints_count}")
print(f"CODING questions needing tieredHints: {len(coding_questions) - hints_count}")

with open(os.path.join(os.path.dirname(__file__), 'coding_questions_audit.json'), 'w', encoding='utf-8') as f:
    json.dump(coding_questions, f, indent=2)
