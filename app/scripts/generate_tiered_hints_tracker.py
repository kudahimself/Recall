import os
import json
import glob
from collections import defaultdict

with open(os.path.join(os.path.dirname(__file__), 'coding_questions_audit.json'), 'r', encoding='utf-8') as f:
    questions = json.load(f)

# File to Subject / Section grouping map
def get_subject_and_section(file, topic):
    # Databricks & PySpark
    if file in ['databricksPlatformQuestions.ts', 'unityCatalogQuestions.ts', 'goldLayerDesignQuestions.ts', 
                'ingestionArchitectureQuestions.ts', 'orchestrationDesignQuestions.ts']:
        return 'Databricks & Lakehouse Architecture', file.replace('.ts', '')
    
    # Python & Django
    if file.startswith('topic_py_'):
        return 'Python Core & Advanced', file.replace('topic_py_', '').replace('.ts', '').upper()
    if file.startswith('topic_dj_'):
        return 'Django & Web Backend', file.replace('topic_dj_', '').replace('.ts', '').upper()
    
    # T-SQL & SQL Engineering
    if file.startswith('topic_tsql_') or file in ['sqlOrderedQuestions.ts', 'sqlMisconceptionMCQs.ts', 'sparkSqlPredictOutputQuestions.ts']:
        return 'SQL & T-SQL Data Engineering', file.replace('topic_tsql_', '').replace('.ts', '').upper()
    
    # Data Engineering Foundations & Architecture
    if file.startswith('dataEngineering') or file in ['dataModelingQuestions.ts', 'projectQuestions.ts']:
        return 'Data Engineering Architecture & Systems', file.replace('.ts', '')

    # Web Development & React / Next.js
    if file in ['a11yShadcnQuestions.ts', 'advancedNextQuestions.ts', 'advancedWebdevOrderedQuestions.ts', 
                'formsTestingQuestions.ts', 'nextjsQuestions.ts', 'prismaQuestions.ts', 'webdevOrderedQuestions.ts',
                'jsBasicsClozeQuestions.ts', 'jsBasicsParsonsQuestions.ts', 'jsBasicsPredictOutputQuestions.ts', 'jsMisconceptionMCQs.ts']:
        return 'Web Development, React & Next.js', file.replace('.ts', '')
    
    # General / Shared Mastery
    if file in ['masteryQuestions.ts', 'expandedQuestions.ts', 'certificationQuestions.ts', 'questions.ts', 'backendOrderedQuestions.ts', 'designPatternQuestions.ts', 'securityQuestions.ts']:
        return 'Core Engineering Mastery & System Design', file.replace('.ts', '')
        
    return 'Other Subjects', file.replace('.ts', '')

# Organize questions by Subject -> Section
grouped = defaultdict(lambda: defaultdict(list))

for q in questions:
    subj, sec = get_subject_and_section(q['file'], q['topic'])
    grouped[subj][sec].append(q)

out = []
out.append("# Tiered Hints Authoring & Audit Tracker\n")
out.append("This document tracks the authoring and audit status of 2-tier hint scaffolds (`tieredHints`: `apiSignature` & `skeleton`) for every **CODING** question across all subjects.\n")

out.append("## 🤖 Agent Operating Instructions (SOP for Any Agent / Subagent)\n")

total_q = len(questions)
completed_q = sum(1 for q in questions if q['has_hints'])

out.append(f"**Total Coding Questions:** `{total_q}` | **Completed Hints:** `{completed_q}` | **Pending Hints:** `{total_q - completed_q}`\n")

out.append("When spawned to author or audit `tieredHints` on CODING questions, follow these instructions strictly:\n")

out.append("### 1. Workflow Sequence")
out.append("1. **Locate Pending Questions:** Pick a topic/file containing 🔴 `Pending` questions.")
out.append("2. **Set In Progress:** Mark the selected question rows as 🟡 `In Progress` in this tracker.")
out.append("3. **Author tieredHints in Source Code:** Open the corresponding `src/data/*.ts` file and add/update `tieredHints` using the reference `solution` as truth:")
out.append("   - **Tier 1 (`apiSignature`):** ONE bare line showing parameter names and defaults. No prose, no argument values.")
out.append("   - **Tier 2 (`skeleton`):** Deletion from solution with `>= 3` `____` markers blanking substance while keeping control flow/wiring.")
out.append("4. **Run Leak & Type Verification:** Run from `app/` directory:")
out.append("   ```powershell")
out.append("   npx tsc --noEmit; node scripts/check-hint-leaks.js")
out.append("   ```")
out.append("5. **Mark Completed:** Update the status to 🟢 `Completed` in this tracker with notes.\n")

out.append("### 2. Mandatory Skill Reference (`.claude/skills/`)")
out.append("- **Authoring Rubric & Leak Rules:** [`write-hints`](file:///C:/Users/kudam/Documents/Github/Recall/.claude/skills/write-hints/SKILL.md) — Tier 1 `apiSignature` & Tier 2 `skeleton` rules and leak floors.\n")

out.append("### 3. Quick Authoring Rubric (`write-hints`)")
out.append("- **Tier 1 - `apiSignature` (The Call Surface):**")
out.append("  - Bare line: parameter names + defaults (`re.sub(pattern, repl, string, count=0) -> str`).")
out.append("  - Zero prose, zero sentences. Never include argument values from the solution.")
out.append("  - If prompt names the API, show the NEXT most load-bearing call in the solution.")
out.append("- **Tier 2 - `skeleton` (Blanked Solution Structure):**")
out.append("  - At least 3 `____` blanks replacing load-bearing substance (methods, operators, key args).")
out.append("  - Keep control flow, indentation, and variable wiring visible.")
out.append("  - Must pass retention floor in `node scripts/check-hint-leaks.js`.\n")

out.append("---\n")
out.append("> **Status Key:**")
out.append("> - 🔴 `Pending` — Needs `tieredHints` authoring or audit against `/write-hints` rubric")
out.append("> - 🟡 `In Progress` — Currently being authored/rewritten")
out.append("> - 🟢 `Completed` — Validated with `check-hint-leaks.js` and type-checked\n")

for subj in sorted(grouped.keys()):
    out.append(f"## {subj}\n")
    for sec in sorted(grouped[subj].keys()):
        qs = grouped[subj][sec]
        out.append(f"### {sec} (`{qs[0]['file']}`)\n")
        out.append("| ID | Difficulty | Topic | Source File | Status | Notes |")
        out.append("|---|---|---|---|---|---|")
        for q in qs:
            status = "🟢 Completed" if q['has_hints'] else "🔴 Pending"
            out.append(f"| `{q['id']}` | {q['difficulty']} | `{q['topic']}` | `{q['file']}` | {status} | |")
        out.append("\n")

tracker_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'TIERED_HINTS_AUDIT_TRACKER.md'))
with open(tracker_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print(f"TIERED_HINTS_AUDIT_TRACKER.md generated at: {tracker_path}")
