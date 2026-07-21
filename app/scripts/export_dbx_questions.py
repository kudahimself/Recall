import json
import re

with open('src/data/questions.ts', 'r', encoding='utf-8') as f:
    q_file_content = f.read()

# Let's inspect all question files and extract question objects accurately
import glob

files = glob.glob('src/data/*.ts')

questions = []

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match objects starting with id: 'question-id' (avoiding option id: 'a')
    matches = re.finditer(r'\{\s*id:\s*[\'"]([a-zA-Z0-9_\-]+)[\'"]\s*,\s*type:\s*QuestionType\.([a-zA-Z_]+)\s*,\s*difficulty:\s*Difficulty\.([a-zA-Z_]+)\s*,\s*topic:\s*Topic\.([a-zA-Z_]+)', content)
    
    for match in matches:
        q_id, q_type, q_diff, q_topic = match.groups()
        questions.append({
            'id': q_id,
            'type': q_type,
            'difficulty': q_diff,
            'topic': q_topic,
            'file': filepath.replace('src/data/', '').replace('\\', '/')
        })

print(f"Accurately parsed {len(questions)} questions.")

with open('dbx_parsed.json', 'w') as f:
    json.dump(questions, f, indent=2)
