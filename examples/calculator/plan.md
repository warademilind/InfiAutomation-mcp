# Calculator observed-UI baseline

Exercise the observed Windows Calculator Standard-mode controls with explicit result assertions. Functional checks are provisional UI-derived expectations, not user-approved business requirements.

Target: desktop

## Source documents

No imported source document linked.

## Requirements

- **UI01** Provisional: Standard mode exposes a visible result display and Clear resets it to zero.
  Source: Observed Header, CalculatorResults and clearButton; acceptance expectation proposed from control semantics.
  - Acceptance: Header is Standard Calculator mode.
  - Acceptance: After Clear, result text is exactly Display is 0.
- **UI02** Provisional: basic arithmetic produces mathematically correct integer results.
  Source: Observed plusButton, minusButton, multiplyButton, divideButton and equalButton.
  - Acceptance: 2 + 3 = 5
  - Acceptance: 9 - 4 = 5
  - Acceptance: 6 × 7 = 42
  - Acceptance: 8 ÷ 2 = 4
- **UI03** Provisional: Backspace removes the final entered digit.
  Source: Observed number pad and backSpaceButton.
  - Acceptance: Entering 12 then Backspace displays 1.
- **UI04** Provisional: Square and Square root perform the named operations.
  Source: Observed xpower2Button and squareRootButton.
  - Acceptance: Square of 3 displays 9.
  - Acceptance: Square root of 9 displays 3.
- **UI05** Provisional: memory store, recall and clear function as named.
  Source: Observed memButton, MemRecall and ClearMemoryButton.
  - Acceptance: Store 7, clear display, recall displays 7.
  - Acceptance: Clearing memory disables Memory recall.
- **WF01** Use observed selectors, executable cases and explicit assertions; keep healing off for the first run.
  Source: User request
  - Acceptance: Suite uses observed UI Automation IDs and explicit assertions.
  - Acceptance: Suite healing is off.
- **WF02** Close inspection session before execution, poll to completion and provide summary, detailed and requirement-coverage reports.
  Source: User request
  - Acceptance: Inspection session is closed before test_run.
  - Acceptance: Finished job and report paths are recorded.

## Open questions

- Which Calculator product/version and modes are required? This run targets the observed Windows Calculator Standard mode.
- Are proposed UI01–UI05 functional expectations approved, or are there source requirements to replace them?
- What are required precision, rounding, overflow, divide-by-zero and negative-square-root behaviors?
- Are decimals, percentages, keyboard input, history, converters, accessibility and persistence in scope?

## Risks

- No functional requirements or acceptance criteria were supplied; UI01–UI05 are provisional and do not establish business acceptance.
- Attached desktop sessions share application state; every case explicitly clears the display and memory case cleans up its memory.
- Only observed Standard mode is covered. Existing history may remain.
- Desktop execution requires an interactive Windows session; locale-dependent text may affect exact assertions.

## Scenarios

### TC-001 - Standard mode and reset

Priority: high | Requirements: UI01, WF01, WF02

Preconditions: One Calculator window open in Standard mode

1. Assert Standard mode header and visible result.
2. Click Clear.
3. Assert exact result Display is 0.

Expected: Standard mode visible; display zero.

### TC-002 - Addition

Priority: high | Requirements: UI02, WF01

Preconditions: Fresh application session

1. Clear.
2. Click 2, Plus, 3, Equals.
3. Assert Display is 5.

Expected: 2 + 3 = 5

### TC-003 - Subtraction

Priority: normal | Requirements: UI02, WF01

Preconditions: Fresh application session

1. Clear.
2. Click 9, Minus, 4, Equals.
3. Assert Display is 5.

Expected: 9 - 4 = 5

### TC-004 - Multiplication

Priority: normal | Requirements: UI02, WF01

Preconditions: Fresh application session

1. Clear.
2. Click 6, Multiply by, 7, Equals.
3. Assert Display is 42.

Expected: 6 × 7 = 42

### TC-005 - Division

Priority: normal | Requirements: UI02, WF01

Preconditions: Fresh application session

1. Clear.
2. Click 8, Divide by, 2, Equals.
3. Assert Display is 4.

Expected: 8 ÷ 2 = 4

### TC-006 - Backspace

Priority: normal | Requirements: UI03, WF01

Preconditions: Fresh application session

1. Clear.
2. Click 1 then 2.
3. Assert Display is 12.
4. Click Backspace.
5. Assert Display is 1.

Expected: Backspace removes last digit.

### TC-007 - Square

Priority: normal | Requirements: UI04, WF01

Preconditions: Fresh application session

1. Clear.
2. Click 3 then Square.
3. Assert Display is 9.

Expected: Square of 3 is 9.

### TC-008 - Square root

Priority: normal | Requirements: UI04, WF01

Preconditions: Fresh application session

1. Clear.
2. Click 9 then Square root.
3. Assert Display is 3.

Expected: Square root of 9 is 3.

### TC-009 - Memory lifecycle

Priority: normal | Requirements: UI05, WF01

Preconditions: Fresh application session

1. Clear.
2. Enter 7 and Memory store.
3. Assert Memory recall enabled.
4. Clear display and assert zero.
5. Recall and assert Display is 7.
6. Clear all memory and assert recall disabled.
7. Clear display.

Expected: Stored value recalled correctly and memory cleared.

## Scenario coverage gaps

Every supplied requirement maps to at least one planned scenario. Execution and acceptance still need verification.

## Observation provenance

Observed window: Calculator

[
  {
    "name": "Calculator",
    "role": "window",
    "controlType": "Window",
    "automationId": "",
    "className": "ApplicationFrameWindow",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 0,
    "path": "Calculator"
  },
  {
    "name": "Calculator",
    "role": "window",
    "controlType": "Window",
    "automationId": "TitleBar",
    "className": "ApplicationFrameTitleBarWindow",
    "enabled": true,
    "visible": false,
    "value": "Calculator",
    "depth": 1,
    "path": "Calculator/0"
  },
  {
    "name": "System",
    "role": "menubar",
    "controlType": "MenuBar",
    "automationId": "SystemMenuBar",
    "className": "",
    "enabled": true,
    "visible": false,
    "value": "",
    "depth": 2,
    "path": "Calculator/0/0"
  },
  {
    "name": "System",
    "role": "menuitem",
    "controlType": "MenuItem",
    "automationId": "",
    "className": "",
    "enabled": true,
    "visible": false,
    "value": "",
    "depth": 3,
    "path": "Calculator/0/0/0"
  },
  {
    "name": "Minimize Calculator",
    "role": "button",
    "controlType": "Button",
    "automationId": "Minimize",
    "className": "",
    "enabled": true,
    "visible": false,
    "value": "",
    "depth": 2,
    "path": "Calculator/0/1"
  },
  {
    "name": "Maximize Calculator",
    "role": "button",
    "controlType": "Button",
    "automationId": "Maximize",
    "className": "",
    "enabled": true,
    "visible": false,
    "value": "",
    "depth": 2,
    "path": "Calculator/0/2"
  },
  {
    "name": "Close Calculator",
    "role": "button",
    "controlType": "Button",
    "automationId": "Close",
    "className": "",
    "enabled": true,
    "visible": false,
    "value": "",
    "depth": 2,
    "path": "Calculator/0/3"
  },
  {
    "name": "Calculator",
    "role": "window",
    "controlType": "Window",
    "automationId": "",
    "className": "Windows.UI.Core.CoreWindow",
    "enabled": true,
    "visible": false,
    "value": "",
    "depth": 1,
    "path": "Calculator/1"
  },
  {
    "name": "Calculator",
    "role": "text",
    "controlType": "Text",
    "automationId": "AppName",
    "className": "TextBlock",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 2,
    "path": "Calculator/1/0"
  },
  {
    "name": "",
    "role": "custom",
    "controlType": "Custom",
    "automationId": "NavView",
    "className": "",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 2,
    "path": "Calculator/1/1"
  },
  {
    "name": "Open Navigation",
    "role": "button",
    "controlType": "Button",
    "automationId": "TogglePaneButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 3,
    "path": "Calculator/1/1/0"
  },
  {
    "name": "",
    "role": "text",
    "controlType": "Text",
    "automationId": "PaneTitleTextBlock",
    "className": "TextBlock",
    "enabled": true,
    "visible": false,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/0/0"
  },
  {
    "name": "",
    "role": "group",
    "controlType": "Group",
    "automationId": "",
    "className": "LandmarkTarget",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 3,
    "path": "Calculator/1/1/1"
  },
  {
    "name": "Expression is 2=",
    "role": "text",
    "controlType": "Text",
    "automationId": "CalculatorExpression",
    "className": "",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/0"
  },
  {
    "name": "Display is 2",
    "role": "text",
    "controlType": "Text",
    "automationId": "CalculatorResults",
    "className": "",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/1"
  },
  {
    "name": "Open history flyout",
    "role": "button",
    "controlType": "Button",
    "automationId": "HistoryButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/2"
  },
  {
    "name": "Memory controls",
    "role": "group",
    "controlType": "Group",
    "automationId": "MemoryPanel",
    "className": "NamedContainerAutomationPeer",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/3"
  },
  {
    "name": "Clear all memory",
    "role": "button",
    "controlType": "Button",
    "automationId": "ClearMemoryButton",
    "className": "Button",
    "enabled": false,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/3/0"
  },
  {
    "name": "Memory recall",
    "role": "button",
    "controlType": "Button",
    "automationId": "MemRecall",
    "className": "Button",
    "enabled": false,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/3/1"
  },
  {
    "name": "Memory add",
    "role": "button",
    "controlType": "Button",
    "automationId": "MemPlus",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/3/2"
  },
  {
    "name": "Memory subtract",
    "role": "button",
    "controlType": "Button",
    "automationId": "MemMinus",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/3/3"
  },
  {
    "name": "Memory store",
    "role": "button",
    "controlType": "Button",
    "automationId": "memButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/3/4"
  },
  {
    "name": "Open memory flyout",
    "role": "button",
    "controlType": "Button",
    "automationId": "MemoryButton",
    "className": "Button",
    "enabled": false,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/3/5"
  },
  {
    "name": "Display controls",
    "role": "group",
    "controlType": "Group",
    "automationId": "DisplayControls",
    "className": "NamedContainerAutomationPeer",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/4"
  },
  {
    "name": "Percent",
    "role": "button",
    "controlType": "Button",
    "automationId": "percentButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/4/0"
  },
  {
    "name": "Clear entry",
    "role": "button",
    "controlType": "Button",
    "automationId": "clearEntryButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/4/1"
  },
  {
    "name": "Clear",
    "role": "button",
    "controlType": "Button",
    "automationId": "clearButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/4/2"
  },
  {
    "name": "Backspace",
    "role": "button",
    "controlType": "Button",
    "automationId": "backSpaceButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/4/3"
  },
  {
    "name": "Standard functions",
    "role": "group",
    "controlType": "Group",
    "automationId": "StandardFunctions",
    "className": "NamedContainerAutomationPeer",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/5"
  },
  {
    "name": "Reciprocal",
    "role": "button",
    "controlType": "Button",
    "automationId": "invertButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/5/0"
  },
  {
    "name": "Square",
    "role": "button",
    "controlType": "Button",
    "automationId": "xpower2Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/5/1"
  },
  {
    "name": "Square root",
    "role": "button",
    "controlType": "Button",
    "automationId": "squareRootButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/5/2"
  },
  {
    "name": "Standard operators",
    "role": "group",
    "controlType": "Group",
    "automationId": "StandardOperators",
    "className": "NamedContainerAutomationPeer",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/6"
  },
  {
    "name": "Divide by",
    "role": "button",
    "controlType": "Button",
    "automationId": "divideButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/6/0"
  },
  {
    "name": "Multiply by",
    "role": "button",
    "controlType": "Button",
    "automationId": "multiplyButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/6/1"
  },
  {
    "name": "Minus",
    "role": "button",
    "controlType": "Button",
    "automationId": "minusButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/6/2"
  },
  {
    "name": "Plus",
    "role": "button",
    "controlType": "Button",
    "automationId": "plusButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/6/3"
  },
  {
    "name": "Equals",
    "role": "button",
    "controlType": "Button",
    "automationId": "equalButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/6/4"
  },
  {
    "name": "Number pad",
    "role": "group",
    "controlType": "Group",
    "automationId": "NumberPad",
    "className": "NamedContainerAutomationPeer",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 4,
    "path": "Calculator/1/1/1/7"
  },
  {
    "name": "Zero",
    "role": "button",
    "controlType": "Button",
    "automationId": "num0Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/0"
  },
  {
    "name": "One",
    "role": "button",
    "controlType": "Button",
    "automationId": "num1Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/1"
  },
  {
    "name": "Two",
    "role": "button",
    "controlType": "Button",
    "automationId": "num2Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/2"
  },
  {
    "name": "Three",
    "role": "button",
    "controlType": "Button",
    "automationId": "num3Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/3"
  },
  {
    "name": "Four",
    "role": "button",
    "controlType": "Button",
    "automationId": "num4Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/4"
  },
  {
    "name": "Five",
    "role": "button",
    "controlType": "Button",
    "automationId": "num5Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/5"
  },
  {
    "name": "Six",
    "role": "button",
    "controlType": "Button",
    "automationId": "num6Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/6"
  },
  {
    "name": "Seven",
    "role": "button",
    "controlType": "Button",
    "automationId": "num7Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/7"
  },
  {
    "name": "Eight",
    "role": "button",
    "controlType": "Button",
    "automationId": "num8Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/8"
  },
  {
    "name": "Nine",
    "role": "button",
    "controlType": "Button",
    "automationId": "num9Button",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/9"
  },
  {
    "name": "Decimal separator",
    "role": "button",
    "controlType": "Button",
    "automationId": "decimalSeparatorButton",
    "className": "Button",
    "enabled": true,
    "visible": true,
    "value": "",
    "depth": 5,
    "path": "Calculator/1/1/1/7/10"
  }
]
