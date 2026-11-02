# Calculator observed-UI baseline

No functional requirement document was provided for the recorded run. UI01–UI05 are provisional expectations derived from the observed controls; WF01–WF02 describe the requested testing workflow. They are not approved product requirements.

This reading view was prepared for publication from the original plan. The original plan JSON, Markdown, executable suite and recorded results are included alongside it.

## UI01

Provisional: Standard mode exposes a visible result display and Clear resets it to zero.

Source: Observed Header, CalculatorResults and clearButton; acceptance expectation proposed from control semantics.

- Header is Standard Calculator mode.
- After Clear, result text is exactly Display is 0.

## UI02

Provisional: basic arithmetic produces mathematically correct integer results.

Source: Observed plusButton, minusButton, multiplyButton, divideButton and equalButton.

- 2 + 3 = 5
- 9 - 4 = 5
- 6 Ã— 7 = 42
- 8 Ã· 2 = 4

## UI03

Provisional: Backspace removes the final entered digit.

Source: Observed number pad and backSpaceButton.

- Entering 12 then Backspace displays 1.

## UI04

Provisional: Square and Square root perform the named operations.

Source: Observed xpower2Button and squareRootButton.

- Square of 3 displays 9.
- Square root of 9 displays 3.

## UI05

Provisional: memory store, recall and clear function as named.

Source: Observed memButton, MemRecall and ClearMemoryButton.

- Store 7, clear display, recall displays 7.
- Clearing memory disables Memory recall.

## WF01

Use observed selectors, executable cases and explicit assertions; keep healing off for the first run.

Source: User request

- Suite uses observed UI Automation IDs and explicit assertions.
- Suite healing is off.

## WF02

Close inspection session before execution, poll to completion and provide summary, detailed and requirement-coverage reports.

Source: User request

- Inspection session is closed before test_run.
- Finished job and report paths are recorded.

## Open questions

- Which Calculator product/version and modes are required? This run targets the observed Windows Calculator Standard mode.
- Are proposed UI01â€“UI05 functional expectations approved, or are there source requirements to replace them?
- What are required precision, rounding, overflow, divide-by-zero and negative-square-root behaviors?
- Are decimals, percentages, keyboard input, history, converters, accessibility and persistence in scope?

## Scope

Nine recorded cases cover Standard mode/reset, four arithmetic operators, Backspace, Square, Square root and memory lifecycle. No error, decimal, rounding, converter, keyboard, accessibility or persistence acceptance is established. Mapping coverage is not business acceptance.
