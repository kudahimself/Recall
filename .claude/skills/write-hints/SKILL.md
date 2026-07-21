---
name: write-hints
description: Author the two-tier hint scaffold (apiSignature + skeleton) for coding questions - what belongs in each tier, and the leak rules
---

# Write Hints

Authoring rubric for `tieredHints` on CODING questions - the attempt-first, partial-credit hint scaffold.
A coding question with `tieredHints` shows nothing before the first submit; a failed submit opens a retry panel where the learner can spend Tier 1 (an API signature) then Tier 2 (a blanked skeleton), each discounting the credit a pass earns.
Absent `tieredHints`, the question keeps classic one-shot behavior and shows no hint button.

Engine mechanics (credit schedule, maturity fade, grade cap) live in `spacedRepetition.ts` and are automatic - authors only write the two tiers well.

## Usage

```bash
/write-hints <id>              # author tieredHints for one coding question
/write-hints <topic>           # author tieredHints for every coding question in a topic
/write-hints review <topic>    # audit existing tieredHints against the rubric
```

## Pedagogical grounding (why two tiers, why attempt-first)

- **Scaffolded feedback** (Finn & Metcalfe) - the learner still generates the answer; a hint narrows the search space, it does not hand over the solution. Both tiers must leave real retrieval work.
- **Diminishing cues** - hints that fade as a card matures support retention better than cues that accumulate. The engine handles the fade (a mature card that still needs the skeleton earns little and stays in the drain); the author's job is only to make each tier a genuine, minimal cue.
- **Attempt-first retrieval** - the unaided first attempt is what drives retention, so hints are locked until one real failed submit. Write hints for the learner who has already tried and is stuck on ONE gap, not for a cold reader.

## Tier 1 - `apiSignature` (the call surface)

ONE line: the call surface of the solution's central API, with parameter names and defaults.
It answers "what are the arguments / what's the shape of the call", not "which function".

**Rules:**
1. One line, no prose, no explanation. A signature, not a sentence.
2. Show parameter names and defaults: `re.sub(pattern, repl, string, count=0) -> str`, `df.merge(right, how='inner', on=None)`.
3. If the prompt already names the API, the signature must not just echo it - show the NEXT most load-bearing call in the solution (the one whose parameters are actually the sticking point).
4. Never include the argument VALUES from the solution - names and defaults only. `sorted(iterable, key=None, reverse=False)`, never `sorted(items, key=lambda x: x[1], reverse=True)`.

❌ `apiSignature: 'Use the re module.'` (prose, names nothing)
❌ `apiSignature: 're.sub(r"\\d+", "#", text)'` (leaks the actual arguments)
✔ `apiSignature: 're.sub(pattern, repl, string, count=0) -> str'`

## Tier 2 - `skeleton` (blanked solution structure)

The solution's structure with load-bearing tokens replaced by `____`, keeping the scaffolding (control flow, variable wiring) visible.
Cloze-style: the learner reconstructs the substance, not the shape.

**Rules:**
1. At least 3 `____` blanks.
2. Blank the SUBSTANCE - API names, key arguments, operators, the tokens being taught. Keep control flow, indentation, and variable names that only wire things together.
3. Never blank trivia while leaving the hard part in plain sight (don't blank `for`/`in` and show the API call).
4. Must not be reconstructable by pattern-matching alone - if deleting the blanks still leaves the answer obvious, blank more of the substance. The leak script enforces a floor (`node scripts/check-hint-leaks.js`).
5. Keep it the shape of the reference `solution`, not a re-derivation - same lines, same order, tokens removed.

❌ blanking `def`, `return`, and a variable name while the actual API call sits visible (trivia blanked, substance shown)
✔ visible `for`/`if`/assignment scaffolding with the method name, its key argument, and the comparison operator each replaced by `____`

## Workflow (per question)

1. Read the reference `solution` first - it is the source of truth for both tiers.
2. Write Tier 2 by DELETION from the solution: copy it, replace the load-bearing tokens with `____`, keep the wiring.
3. Write Tier 1 from Tier 2's most-blanked call - the signature of whatever the skeleton hides most.
4. Run `node scripts/check-hint-leaks.js` (from `app/`) and clear any flag before calling it done.

## Review workflow (`/write-hints review <topic>`)

For each coding question with `tieredHints`, classify:
- **Clean** - Tier 1 is a bare parameterized signature; Tier 2 blanks the substance (>= 3 blanks) and passes the leak floor.
- **Weak** - passes but a tier is soft (signature echoes the prompt's named API; skeleton blanks too little to force retrieval).
- **Bad** - a tier leaks (signature carries argument values; skeleton reconstructable by pattern-match; < 3 blanks) or is prose.

Cite the question id and the specific rule. When proposing a fix, show the corrected `apiSignature` / `skeleton`, not just the diagnosis.

## Summary checklist

| Check | Rule |
| :--- | :--- |
| Tier 1 one line | `apiSignature` is a signature, no prose |
| Tier 1 params | parameter names + defaults, never argument values |
| Tier 1 not an echo | if prompt names the API, show the next load-bearing call |
| Tier 2 depth | >= 3 `____`, substance blanked, wiring kept |
| Tier 2 leak floor | passes `node scripts/check-hint-leaks.js` |
| Coding only | `tieredHints` only on CODING questions |
