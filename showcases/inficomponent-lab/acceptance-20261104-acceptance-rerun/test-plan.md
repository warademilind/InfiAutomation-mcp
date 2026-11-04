# InfiComponent Lab acceptance 20261104-acceptance-rerun

Execute the supplied LAB01-LAB16 acceptance requirements against the unmodified packaged EXE using C:/InfiAutomation 0.5.0; record detailed steps, real state assertions and explicit supplementary gaps.

Target: mixed

## Source documents

- reports/acceptance-20261104-acceptance-rerun/requirements.md (SHA-256 1fb3f3ad4746e6a592efbcdfecfd73c34fc90002c9f9ac94fcfd2cdfd35feee6)

## Requirements

- **LAB01** An owned packaged Electron launch opens the unique Workspace title and seven main navigation menu groups, each with three subpages.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: An owned packaged Electron launch opens the unique Workspace title and seven main navigation menu groups, each with three subpages.
- **LAB02** Registration rejects missing required fields and saves a valid name, email and terms acceptance through the backend, displaying the submitted name.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Registration rejects missing required fields and saves a valid name, email and terms acceptance through the backend, displaying the submitted name.
- **LAB03** Input controls expose observable values, including a keyboard-controlled slider, dates, multiple selection and a custom framework combobox.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Input controls expose observable values, including a keyboard-controlled slider, dates, multiple selection and a custom framework combobox.
- **LAB04** Project validation enforces ABC-123 format, team size 1–20, an eight-character passphrase and matching confirmation.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Project validation enforces ABC-123 format, team size 1–20, an eight-character passphrase and matching confirmation.
- **LAB05** Customers can be created, edited, searched and deleted through the renderer and persistent REST backend.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Customers can be created, edited, searched and deleted through the renderer and persistent REST backend.
- **LAB06** The advanced grid supports five-row selection and pagination over the eighteen seeded records.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: The advanced grid supports five-row selection and pagination over the eighteen seeded records.
- **LAB07** Native File > Export > Export JSON writes a JSON file and reports its path; native View > Compact mode toggles a real state.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Native File > Export > Export JSON writes a JSON file and reports its path; native View > Compact mode toggles a real state.
- **LAB08** An explicit DOM File menu saves a note, double click produces a result, and the disabled action stays disabled.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: An explicit DOM File menu saves a note, double click produces a result, and the disabled action stays disabled.
- **LAB09** Submitting the workspace note dialog displays the entered value. Cancelling closes it without saving.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Submitting the workspace note dialog displays the entered value. Cancelling closes it without saving.
- **LAB10** Tabs switch visible panels and expanding the project tree allows Reports to be selected.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Tabs switch visible panels and expanding the project tree allows Reports to be selected.
- **LAB11** A same-origin iframe form and an open shadow-root form save independent feedback values.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: A same-origin iframe form and an open shadow-root form save independent feedback values.
- **LAB12** Wrong credentials are rejected; tester@example.test / LabPass!2026 signs in; session read and logout work.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Wrong credentials are rejected; tester@example.test / LabPass!2026 signs in; session read and logout work.
- **LAB13** A three-step order workflow validates input and confirmation and creates a persistent order.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: A three-step order workflow validates input and confirmation and creates a persistent order.
- **LAB14** The intentional HTTP 503 scenario reports an error; switching to Success recovers; delayed content appears when ready.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: The intentional HTTP 503 scenario reports an error; switching to Success recovers; delayed content appears when ready.
- **LAB15** Inspector opens in a separate uniquely titled renderer with an independently saved note, and selection can return to Workspace.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Inspector opens in a separate uniquely titled renderer with an independently saved note, and selection can return to Workspace.
- **LAB16** A customer created through the REST API appears as one matching row in the renderer.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: A customer created through the REST API appears as one matching row in the renderer.
- **SUP01** Synthetic upload/download bytes and renderer file listing.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Synthetic upload/download bytes and renderer file listing.
- **SUP02** Task creation and keyboard-accessible lane transition.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Task creation and keyboard-accessible lane transition.
- **SUP03** Tooltip, popover, progress, meter, canvas equivalent and local audio asset.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Tooltip, popover, progress, meter, canvas equivalent and local audio asset.
- **SUP04** Editable rich text value.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Editable rich text value.
- **SUP05** Preference persistence across owned launches.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Preference persistence across owned launches.
- **SUP06** Command search and activity filtering.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Command search and activity filtering.
- **SUP07** Asynchronous request cancellation and recovery.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Asynchronous request cancellation and recovery.
- **SAFE01** Confirmed test-profile-only reset with cancellation.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Confirmed test-profile-only reset with cancellation.
- **SAFE02** Reset is disabled and denied without --test-mode.
  Source: reports/acceptance-20261104-acceptance-rerun/requirements.md
  - Acceptance: Reset is disabled and denied without --test-mode.

## Open questions

None supplied. This does not prove the requirements are complete.

## Risks

- Synthetic local application only; no production-system acceptance is implied.
- CSV browser downloads, physical drag/drop, native file selection and audio playback need separately recorded platform evidence.
- A mapped passed smoke case is not exhaustive component coverage.
- MCP MenuItem.click proves command results; Windows UIA separately checks actual OS dialog controls.

## Scenarios

### TC-001 - LAB01 — Packaged Workspace has seven groups with three working subpages each

Priority: high | Requirements: LAB01

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Unique Workspace title
3. Expect 7 elements: .nav-group
4. Expect 3 elements: [data-testid^="nav-workspace-"]
5. Navigate > Workspace
6. Expect page-title = A workspace built to be tested.
7. Open workspace/overview
8. Expect page-title = A workspace built to be tested.
9. Navigate > Workspace
10. Expect page-title = A workspace built to be tested.
11. Open workspace/activity
12. Expect page-title = Activity log
13. Navigate > Workspace
14. Expect page-title = A workspace built to be tested.
15. Open workspace/session
16. Expect page-title = Sign-in sandbox
17. Expect 3 elements: [data-testid^="nav-forms-"]
18. Navigate > Forms
19. Expect page-title = Registration form
20. Open forms/registration
21. Expect page-title = Registration form
22. Navigate > Forms
23. Expect page-title = Registration form
24. Open forms/input-lab
25. Expect page-title = Input laboratory
26. Navigate > Forms
27. Expect page-title = Registration form
28. Open forms/validation
29. Expect page-title = Validation & editor
30. Expect 3 elements: [data-testid^="nav-records-"]
31. Navigate > Records
32. Expect page-title = Customers
33. Open records/customers
34. Expect page-title = Customers
35. Navigate > Records
36. Expect page-title = Customers
37. Open records/orders
38. Expect page-title = Orders
39. Navigate > Records
40. Expect page-title = Customers
41. Open records/grid
42. Expect page-title = Advanced data grid
43. Expect 3 elements: [data-testid^="nav-components-"]
44. Navigate > Components
45. Expect page-title = Buttons & menus
46. Open components/actions
47. Expect page-title = Buttons & menus
48. Navigate > Components
49. Expect page-title = Buttons & menus
50. Open components/overlays
51. Expect page-title = Dialogs & overlays
52. Navigate > Components
53. Expect page-title = Buttons & menus
54. Open components/structure
55. Expect page-title = Tabs, tree & accordion
56. Expect 3 elements: [data-testid^="nav-files-"]
57. Navigate > Files & Media
58. Expect page-title = Upload center
59. Open files/uploads
60. Expect page-title = Upload center
61. Navigate > Files & Media
62. Expect page-title = Upload center
63. Open files/downloads
64. Expect page-title = Downloads & exports
65. Navigate > Files & Media
66. Expect page-title = Upload center
67. Open files/preview
68. Expect page-title = Frames & media
69. Expect 3 elements: [data-testid^="nav-workflows-"]
70. Navigate > Workflows
71. Expect page-title = Task board
72. Open workflows/board
73. Expect page-title = Task board
74. Navigate > Workflows
75. Expect page-title = Task board
76. Open workflows/wizard
77. Expect page-title = Order wizard
78. Navigate > Workflows
79. Expect page-title = Task board
80. Open workflows/requests
81. Expect page-title = Async & recovery
82. Expect 3 elements: [data-testid^="nav-settings-"]
83. Navigate > Settings
84. Expect page-title = Preferences
85. Open settings/preferences
86. Expect page-title = Preferences
87. Navigate > Settings
88. Expect page-title = Preferences
89. Open settings/connections
90. Expect page-title = Windows & connections
91. Navigate > Settings
92. Expect page-title = Preferences
93. Open settings/runtime
94. Expect page-title = Runtime & test data
95. Health identifies synthetic test-mode app

Expected: Expect page-title = A workspace built to be tested.; Unique Workspace title; Expect 7 elements: .nav-group; Expect 3 elements: [data-testid^="nav-workspace-"]; Expect page-title = A workspace built to be tested.; Expect page-title = A workspace built to be tested.; Expect page-title = A workspace built to be tested.; Expect page-title = Activity log; Expect page-title = A workspace built to be tested.; Expect page-title = Sign-in sandbox; Expect 3 elements: [data-testid^="nav-forms-"]; Expect page-title = Registration form; Expect page-title = Registration form; Expect page-title = Registration form; Expect page-title = Input laboratory; Expect page-title = Registration form; Expect page-title = Validation & editor; Expect 3 elements: [data-testid^="nav-records-"]; Expect page-title = Customers; Expect page-title = Customers; Expect page-title = Customers; Expect page-title = Orders; Expect page-title = Customers; Expect page-title = Advanced data grid; Expect 3 elements: [data-testid^="nav-components-"]; Expect page-title = Buttons & menus; Expect page-title = Buttons & menus; Expect page-title = Buttons & menus; Expect page-title = Dialogs & overlays; Expect page-title = Buttons & menus; Expect page-title = Tabs, tree & accordion; Expect 3 elements: [data-testid^="nav-files-"]; Expect page-title = Upload center; Expect page-title = Upload center; Expect page-title = Upload center; Expect page-title = Downloads & exports; Expect page-title = Upload center; Expect page-title = Frames & media; Expect 3 elements: [data-testid^="nav-workflows-"]; Expect page-title = Task board; Expect page-title = Task board; Expect page-title = Task board; Expect page-title = Order wizard; Expect page-title = Task board; Expect page-title = Async & recovery; Expect 3 elements: [data-testid^="nav-settings-"]; Expect page-title = Preferences; Expect page-title = Preferences; Expect page-title = Preferences; Expect page-title = Windows & connections; Expect page-title = Preferences; Expect page-title = Runtime & test data; Health identifies synthetic test-mode app

### TC-002 - LAB02 — Registration rejects missing name/email/terms and records a backend submission

Priority: high | Requirements: LAB02

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Forms
3. Expect page-title = Registration form
4. Open forms/registration
5. Expect page-title = Registration form
6. Click Save registration
7. Expect page-result = required fields
8. Fill Full name *
9. Click Save registration
10. Expect page-result = required fields
11. Fill Email *
12. Check I accept the demo terms (required)
13. Click Save registration
14. Expect page-result = required fields
15. Fill Email *
16. Uncheck I accept the demo terms (required)
17. Click Save registration
18. Expect page-result = required fields
19. Backend independently rejects missing terms
20. Check I accept the demo terms (required)
21. Click Save registration
22. Expect page-result = Registration saved for Acceptance Tester
23. Submission produced a persisted form event

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Registration form; Expect page-title = Registration form; Expect page-result = required fields; Expect page-result = required fields; Expect page-result = required fields; Expect page-result = required fields; Backend independently rejects missing terms; Expect page-result = Registration saved for Acceptance Tester; Submission produced a persisted form event

### TC-003 - LAB03 — Dates, multiple selection, keyboard slider and framework expose submitted values

Priority: high | Requirements: LAB03

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Forms
3. Expect page-title = Registration form
4. Open forms/input-lab
5. Expect page-title = Input laboratory
6. Fill Quantity
7. Fill Start date
8. Fill Start time
9. Fill Meeting date and time
10. Fill Reporting month
11. Fill Reporting week
12. Press Home in Confidence
13. Expect Confidence value
14. Press End in Confidence
15. Expect Confidence value
16. Select Skills (multiple selection) = Playwright
17. Press Shift+ArrowDown in Skills (multiple selection)
18. Expect 2 elements: select[name="skills"] option:checked
19. Fill Test framework
20. Choose observed framework
21. Expect Test framework value
22. Click Read input values
23. Expect input-values = "quantity": "9"
24. Expect input-values = "date": "2026-11-15"
25. Expect input-values = "time": "14:45"
26. Expect input-values = "datetime": "2026-11-15T14:45"
27. Expect input-values = "month": "2026-12"
28. Expect input-values = "week": "2026-W47"
29. Expect input-values = "confidence": "100"
30. Expect input-values = "Playwright"
31. Expect input-values = "Electron"
32. Expect input-values = "framework": "InfiAutomation"

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Registration form; Expect page-title = Input laboratory; Expect Confidence value; Expect Confidence value; Expect 2 elements: select[name="skills"] option:checked; Expect Test framework value; Expect input-values = "quantity": "9"; Expect input-values = "date": "2026-11-15"; Expect input-values = "time": "14:45"; Expect input-values = "datetime": "2026-11-15T14:45"; Expect input-values = "month": "2026-12"; Expect input-values = "week": "2026-W47"; Expect input-values = "confidence": "100"; Expect input-values = "Playwright"; Expect input-values = "Electron"; Expect input-values = "framework": "InfiAutomation"

### TC-004 - LAB04 — Project format, team boundaries, password length and confirmation are enforced

Priority: high | Requirements: LAB04

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Forms
3. Expect page-title = Registration form
4. Open forms/validation
5. Expect page-title = Validation & editor
6. Click Validate project
7. Expect page-result = Check project code
8. Fill Project code
9. Fill Secure passphrase
10. Fill Confirm passphrase
11. Click Validate project
12. Expect page-result = Check project code
13. Fill Project code
14. Click Validate project
15. Expect page-result = Check project code
16. Fill Project code
17. Fill Team size
18. Click Validate project
19. Expect page-result = Check project code
20. Fill Team size
21. Click Validate project
22. Expect page-result = Check project code
23. Fill Team size
24. Fill Secure passphrase
25. Fill Confirm passphrase
26. Click Validate project
27. Expect page-result = Check project code
28. Fill Secure passphrase
29. Fill Confirm passphrase
30. Click Validate project
31. Expect page-result = Passphrases do not match.
32. Fill Confirm passphrase
33. Click Validate project
34. Expect page-result = Project ABC-123 is valid.
35. Fill Team size
36. Click Validate project
37. Expect page-result = Project ABC-123 is valid.

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Registration form; Expect page-title = Validation & editor; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Passphrases do not match.; Expect page-result = Project ABC-123 is valid.; Expect page-result = Project ABC-123 is valid.

### TC-005 - LAB05 — Customers create, edit, search, persist and delete across UI and REST

Priority: high | Requirements: LAB05

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Records
3. Expect page-title = Customers
4. Open records/customers
5. Expect page-title = Customers
6. Click + Add customer
7. Fill Customer name
8. Fill Email address
9. Click Create customer
10. Fill Search customers
11. Expect 1 elements: [data-testid="customer-row"]
12. Created customer exists in REST
13. Navigate > Workspace
14. Expect page-title = A workspace built to be tested.
15. Open workspace/overview
16. Expect page-title = A workspace built to be tested.
17. Navigate > Records
18. Expect page-title = Customers
19. Open records/customers
20. Expect page-title = Customers
21. Fill Search customers
22. Expect 1 elements: [data-testid="customer-row"]
23. Click Edit Acceptance Customer
24. Fill Customer name
25. Click Save changes
26. Edited customer persisted
27. Fill Search customers
28. Expect 1 elements: [data-testid="customer-row"]
29. Click Delete Acceptance Updated
30. Click Delete customer
31. Fill Search customers
32. Expect empty-customers = No customers match your filters.
33. Deleted customer is absent

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Customers; Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]; Created customer exists in REST; Expect page-title = A workspace built to be tested.; Expect page-title = A workspace built to be tested.; Expect page-title = Customers; Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]; Edited customer persisted; Expect 1 elements: [data-testid="customer-row"]; Expect empty-customers = No customers match your filters.; Deleted customer is absent

### TC-006 - LAB06 — Grid selects five of eighteen records and paginates to the final three

Priority: high | Requirements: LAB06

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Records
3. Expect page-title = Customers
4. Open records/grid
5. Expect page-title = Advanced data grid
6. Expect .pagination text
7. Expect 5 elements: #grid-table tbody tr
8. Check Select current page
9. Expect #selection-count text
10. Click Next page
11. Expect .pagination text
12. Expect #selection-count text
13. Click Next page
14. Click Next page
15. Expect .pagination text
16. Expect 3 elements: #grid-table tbody tr
17. Expected enabled=false: Next page
18. Click Previous page
19. Expect .pagination text

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Customers; Expect page-title = Advanced data grid; Expect .pagination text; Expect 5 elements: #grid-table tbody tr; Expect #selection-count text; Expect .pagination text; Expect #selection-count text; Expect .pagination text; Expect 3 elements: #grid-table tbody tr; Expected enabled=false: Next page; Expect .pagination text

### TC-007 - LAB07 — Native JSON export reports a real path and Compact changes renderer state

Priority: high | Requirements: LAB07

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. File > Export > Export JSON
3. Expect command-status = C:/InfiComponentLab\.runtime\acceptance-execution-20261104-acceptance-rerun-1793786183771\lab-data\infi-lab-export.json
4. View > Compact mode
5. Expect command-status = Compact mode on
6. Expect 1 elements: body.compact
7. View > Compact mode
8. Expect command-status = Compact mode off
9. Expect 0 elements: body.compact

Expected: Expect page-title = A workspace built to be tested.; Expect command-status = C:/InfiComponentLab\.runtime\acceptance-execution-20261104-acceptance-rerun-1793786183771\lab-data\infi-lab-export.json; Expect command-status = Compact mode on; Expect 1 elements: body.compact; Expect command-status = Compact mode off; Expect 0 elements: body.compact

### TC-008 - LAB08 — DOM File action, double click and disabled button preserve explicit behavior

Priority: high | Requirements: LAB08

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Components
3. Expect page-title = Buttons & menus
4. Open components/actions
5. Expect page-title = Buttons & menus
6. Explicit DOM File > Save note
7. Expect page-result = DOM note saved
8. Double click
9. Expect page-result = Double-click detected
10. Disabled remains disabled

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Buttons & menus; Expect page-title = Buttons & menus; Expect page-result = DOM note saved; Expect page-result = Double-click detected; Disabled remains disabled

### TC-009 - LAB09 — Note dialog cancels without saving and saves only the submitted note

Priority: high | Requirements: LAB09

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Components
3. Expect page-title = Buttons & menus
4. Open components/overlays
5. Expect page-title = Dialogs & overlays
6. Click Open modal
7. Fill Workspace note
8. Click Cancel
9. Expect 0 elements: #app-dialog[open]
10. Expect 0 elements: [data-testid="page-result"]:not([hidden])
11. Click Open modal
12. Fill Workspace note
13. Click Save note
14. Expect 0 elements: #app-dialog[open]
15. Expect page-result = Note saved: Acceptance saved note
16. Click Open modal
17. Fill Workspace note
18. Click Cancel
19. Expect 0 elements: #app-dialog[open]
20. Expect page-result = Note saved: Acceptance saved note

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Buttons & menus; Expect page-title = Dialogs & overlays; Expect 0 elements: #app-dialog[open]; Expect 0 elements: [data-testid="page-result"]:not([hidden]); Expect 0 elements: #app-dialog[open]; Expect page-result = Note saved: Acceptance saved note; Expect 0 elements: #app-dialog[open]; Expect page-result = Note saved: Acceptance saved note

### TC-010 - LAB10 — Tabs change visible panels and expanded tree selects Reports

Priority: high | Requirements: LAB10

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Components
3. Expect page-title = Buttons & menus
4. Open components/structure
5. Expect page-title = Tabs, tree & accordion
6. Open Details
7. Expect 1 elements: #tab-panel-1:not([hidden])
8. Expect 1 elements: #tab-panel-0[hidden]
9. Open History
10. Expect 1 elements: #tab-panel-2:not([hidden])
11. Expand project
12. Select Reports
13. Expect page-result = Tree selected: Reports
14. Expect 1 elements: [role="treeitem"][aria-selected="true"][data-tree-leaf="Reports"]

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Buttons & menus; Expect page-title = Tabs, tree & accordion; Expect 1 elements: #tab-panel-1:not([hidden]); Expect 1 elements: #tab-panel-0[hidden]; Expect 1 elements: #tab-panel-2:not([hidden]); Expect page-result = Tree selected: Reports; Expect 1 elements: [role="treeitem"][aria-selected="true"][data-tree-leaf="Reports"]

### TC-011 - LAB11 — Same-origin iframe and open shadow forms retain independent feedback

Priority: high | Requirements: LAB11

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Files & Media
3. Expect page-title = Upload center
4. Open files/preview
5. Expect page-title = Frames & media
6. Frame feedback
7. Save frame
8. Frame saved
9. Shadow feedback
10. Click Save shadow feedback
11. Expect shadow-output = Shadow saved: Acceptance shadow
12. Frame remains independent

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Upload center; Expect page-title = Frames & media; Frame saved; Expect shadow-output = Shadow saved: Acceptance shadow; Frame remains independent

### TC-012 - LAB12 — Invalid credentials reject; login, session read, logout and post-logout denial work

Priority: high | Requirements: LAB12

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Workspace
3. Expect page-title = A workspace built to be tested.
4. Open workspace/session
5. Expect page-title = Sign-in sandbox
6. Fill Account email
7. Fill Account password
8. Click Sign in
9. Expect page-result = incorrect
10. Fill Account password
11. Click Sign in
12. Expect session-user = Signed in as Alex Morgan
13. Click Check session
14. Expect page-result = Session is active
15. Click Sign out
16. Expect session-user = Signed out
17. Click Check session
18. Expect page-result = Sign in to continue

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = A workspace built to be tested.; Expect page-title = Sign-in sandbox; Expect page-result = incorrect; Expect session-user = Signed in as Alex Morgan; Expect page-result = Session is active; Expect session-user = Signed out; Expect page-result = Sign in to continue

### TC-013 - LAB13 — Wizard validates all three stages and persists the resulting order

Priority: high | Requirements: LAB13

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Workflows
3. Expect page-title = Task board
4. Open workflows/wizard
5. Expect page-title = Order wizard
6. Click Continue
7. Expect 1 elements: #wizard-form select[name="customer"]
8. Select Order customer = Aarav Shah
9. Click Continue
10. Fill Order amount
11. Click Continue
12. Expect 1 elements: #wizard-form input[name="amount"]
13. Fill Order amount
14. Click Continue
15. Expect order-review = Customer: Aarav Shah
16. Click Place order
17. Expect 1 elements: #wizard-form input[name="confirmed"]:not(:checked)
18. No order without confirmation
19. Check I confirm this demo order
20. Click Place order
21. Expect order-success = created for Aarav Shah
22. Order exists in persisted backend
23. Click View orders
24. Expect page-title = Orders
25. Expect #order-table tbody tr:first-child text
26. Expect #order-table tbody tr:first-child text

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Task board; Expect page-title = Order wizard; Expect 1 elements: #wizard-form select[name="customer"]; Expect 1 elements: #wizard-form input[name="amount"]; Expect order-review = Customer: Aarav Shah; Expect 1 elements: #wizard-form input[name="confirmed"]:not(:checked); No order without confirmation; Expect order-success = created for Aarav Shah; Order exists in persisted backend; Expect page-title = Orders; Expect #order-table tbody tr:first-child text; Expect #order-table tbody tr:first-child text

### TC-014 - LAB14 — HTTP 503 error is reported, Success recovers and delayed content becomes ready

Priority: high | Requirements: LAB14

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Workflows
3. Expect page-title = Task board
4. Open workflows/requests
5. Expect page-title = Async & recovery
6. Intentional error is actual HTTP 503
7. Select Response scenario = Server error
8. Click Send request
9. Expect request-response = Intentional lab error
10. Select Response scenario = Success
11. Click Send request
12. Expect request-response = Request completed successfully
13. Click Load delayed content
14. Expect delayed-result = Delayed content is ready

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Task board; Expect page-title = Async & recovery; Intentional error is actual HTTP 503; Expect request-response = Intentional lab error; Expect request-response = Request completed successfully; Expect delayed-result = Delayed content is ready

### TC-015 - LAB15 — Uniquely titled Inspector stores its own note and returns to Workspace

Priority: high | Requirements: LAB15

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Tools > Open Inspector
3. Select Inspector
4. Inspector unique title
5. Fill Inspector note
6. Click Save inspector note
7. Expect inspector-result = Inspector saved: Acceptance independent note
8. Select Workspace
9. Workspace title
10. Expect 0 elements: [data-testid="inspector-result"]
11. Return Inspector retains note
12. Expect inspector-result = Inspector saved: Acceptance independent note
13. Return Workspace

Expected: Expect page-title = A workspace built to be tested.; Inspector unique title; Expect inspector-result = Inspector saved: Acceptance independent note; Workspace title; Expect 0 elements: [data-testid="inspector-result"]; Expect inspector-result = Inspector saved: Acceptance independent note

### TC-016 - LAB16 — API-created synthetic customer is exactly one matching renderer row

Priority: high | Requirements: LAB16

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Start owned app before REST
3. Create REST customer
4. Navigate > Records
5. Expect page-title = Customers
6. Open records/customers
7. Expect page-title = Customers
8. Fill Search customers
9. Expect 1 elements: [data-testid="customer-row"]
10. Expect [data-testid="customer-row"] text
11. Expect [data-testid="customer-row"] text

Expected: Expect page-title = A workspace built to be tested.; Start owned app before REST; Create REST customer; Expect page-title = Customers; Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]; Expect [data-testid="customer-row"] text; Expect [data-testid="customer-row"] text

### TC-017 - SUP01 — Upload/download API returns identical bytes and renderer lists the real file

Priority: normal | Requirements: SUP01

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Start app
3. Upload synthetic bytes
4. Download identical bytes
5. Navigate > Files & Media
6. Expect page-title = Upload center
7. Open files/uploads
8. Expect page-title = Upload center
9. Expect #uploaded-files text
10. Expect 1 elements: #uploaded-files a[download="acceptance.txt"]

Expected: Expect page-title = A workspace built to be tested.; Start app; Upload synthetic bytes; Download identical bytes; Expect page-title = Upload center; Expect page-title = Upload center; Expect #uploaded-files text; Expect 1 elements: #uploaded-files a[download="acceptance.txt"]

### TC-018 - SUP02 — Task keyboard alternative creates and moves a persistent task

Priority: normal | Requirements: SUP02

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Workflows
3. Expect page-title = Task board
4. Open workflows/board
5. Expect page-title = Task board
6. Fill New task title
7. Click + Add task
8. Select Move Acceptance keyboard task = Done
9. Expect page-result = Task moved to Done
10. Expect Move Acceptance keyboard task value
11. Task move persisted

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Task board; Expect page-title = Task board; Expect page-result = Task moved to Done; Expect Move Acceptance keyboard task value; Task move persisted

### TC-019 - SUP03 — Tooltip, popover, progress, meter and accessible canvas have observable results

Priority: normal | Requirements: SUP03

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Components
3. Expect page-title = Buttons & menus
4. Open components/actions
5. Expect page-title = Buttons & menus
6. Hover observed tooltip trigger
7. Tooltip visible
8. Navigate > Components
9. Expect page-title = Buttons & menus
10. Open components/overlays
11. Expect page-title = Dialogs & overlays
12. Click Open popover
13. Expect 1 elements: #details-popover:popover-open
14. Click Close popover
15. Expect 0 elements: #details-popover:popover-open
16. Navigate > Components
17. Expect page-title = Buttons & menus
18. Open components/structure
19. Expect page-title = Tabs, tree & accordion
20. Click Advance progress
21. Expect 1 elements: #demo-progress[value="50"]
22. Expect 1 elements: meter[value="62"]
23. Navigate > Files & Media
24. Expect page-title = Upload center
25. Open files/preview
26. Expect page-title = Frames & media
27. Click Change canvas signal
28. Expect #canvas-result text
29. Local audio asset exists

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Buttons & menus; Expect page-title = Buttons & menus; Tooltip visible; Expect page-title = Buttons & menus; Expect page-title = Dialogs & overlays; Expect 1 elements: #details-popover:popover-open; Expect 0 elements: #details-popover:popover-open; Expect page-title = Buttons & menus; Expect page-title = Tabs, tree & accordion; Expect 1 elements: #demo-progress[value="50"]; Expect 1 elements: meter[value="62"]; Expect page-title = Upload center; Expect page-title = Frames & media; Expect #canvas-result text; Local audio asset exists

### TC-020 - SUP04 — Rich text value appears in valid project result

Priority: normal | Requirements: SUP04

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Forms
3. Expect page-title = Registration form
4. Open forms/validation
5. Expect page-title = Validation & editor
6. Fill Project code
7. Fill Secure passphrase
8. Fill Confirm passphrase
9. Fill Release notes
10. Click Validate project
11. Expect page-result = Release notes: Acceptance rich text note

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Registration form; Expect page-title = Validation & editor; Expect page-result = Release notes: Acceptance rich text note

### TC-021 - SUP05 — Preferences save real theme, compact mode, locale and notification values

Priority: normal | Requirements: SUP05

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Settings
3. Expect page-title = Preferences
4. Open settings/preferences
5. Expect page-title = Preferences
6. Select Theme = dark
7. Select Locale = en-GB
8. Check Compact table rows
9. Uncheck Workspace notifications
10. Click Save preferences
11. Expect page-result = Preferences saved
12. Expect 1 elements: body.dark.compact
13. Preferences persisted in backend

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Preferences; Expect page-title = Preferences; Expect page-result = Preferences saved; Expect 1 elements: body.dark.compact; Preferences persisted in backend

### TC-022 - SUP06 — A new owned launch reads persisted preferences, customer and order

Priority: normal | Requirements: SUP05, LAB05, LAB13, LAB16

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Settings
3. Expect page-title = Preferences
4. Open settings/preferences
5. Expect page-title = Preferences
6. Expect Theme value
7. Expect Locale value
8. Compact preference persists
9. Expect 1 elements: body.dark.compact
10. Order persisted across launch
11. Navigate > Records
12. Expect page-title = Customers
13. Open records/customers
14. Expect page-title = Customers
15. Fill Search customers
16. Expect 1 elements: [data-testid="customer-row"]

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Preferences; Expect page-title = Preferences; Expect Theme value; Expect Locale value; Compact preference persists; Expect 1 elements: body.dark.compact; Order persisted across launch; Expect page-title = Customers; Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]

### TC-023 - SUP07 — Command search and activity filtering expose specific results

Priority: normal | Requirements: SUP06

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Click Search pages
3. Fill observed search input
4. Choose observed page search result
5. Expect page-title = Registration form
6. Navigate > Workspace
7. Expect page-title = A workspace built to be tested.
8. Open workspace/activity
9. Expect page-title = Activity log
10. Fill Filter events
11. Expect 1 elements: #event-list .activity-item
12. Expect #event-list text
13. Fill Filter events
14. Expect 0 elements: #event-list .activity-item

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Registration form; Expect page-title = A workspace built to be tested.; Expect page-title = Activity log; Expect 1 elements: #event-list .activity-item; Expect #event-list text; Expect 0 elements: #event-list .activity-item

### TC-024 - SUP08 — Slow request can cancel and then recover successfully

Priority: normal | Requirements: SUP07

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Workflows
3. Expect page-title = Task board
4. Open workflows/requests
5. Expect page-title = Async & recovery
6. Select Response scenario = Slow response
7. Click Send request
8. Click Cancel request
9. Expect request-response = Request cancelled
10. Expected enabled=true: Send request
11. Expected enabled=false: Cancel request
12. Select Response scenario = Success
13. Click Send request
14. Expect request-response = Request completed successfully

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Task board; Expect page-title = Async & recovery; Expect request-response = Request cancelled; Expected enabled=true: Send request; Expected enabled=false: Cancel request; Expect request-response = Request completed successfully

### TC-025 - SAFE01 — Test-mode reset requires confirmation, cancellation preserves data, confirmed reset restores seed

Priority: normal | Requirements: SAFE01

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Settings
3. Expect page-title = Preferences
4. Open settings/runtime
5. Expect page-title = Runtime & test data
6. Click Reset test data
7. Click Cancel
8. Cancelled reset preserved synthetic customer
9. Click Reset test data
10. Click Reset data
11. Reset modal closed
12. Confirmed reset restores all seeded state

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Preferences; Expect page-title = Runtime & test data; Cancelled reset preserved synthetic customer; Reset modal closed; Confirmed reset restores all seeded state

### TC-026 - SAFE02 — Without --test-mode, UI/native reset are unavailable and backend reset returns 403

Priority: normal | Requirements: SAFE02

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Expect page-title = A workspace built to be tested.
2. Navigate > Settings
3. Expect page-title = Preferences
4. Open settings/runtime
5. Expect page-title = Runtime & test data
6. Expected enabled=false: Reset test data
7. Backend rejects reset outside test mode

Expected: Expect page-title = A workspace built to be tested.; Expect page-title = Preferences; Expect page-title = Runtime & test data; Expected enabled=false: Reset test data; Backend rejects reset outside test mode

## Scenario coverage gaps

Every supplied requirement maps to at least one planned scenario. Execution and acceptance still need verification.

## Observation provenance

Observed window: InfiComponent Lab - Workspace

[
  {
    "name": "Skip to content",
    "role": "link",
    "text": "Skip to content",
    "visible": true,
    "enabled": true,
    "depth": 1
  },
  {
    "name": "i\n•\nInfiComponent\nLAB / DESKTOP",
    "role": "link",
    "text": "i\n•\nInfiComponent\nLAB / DESKTOP",
    "visible": true,
    "enabled": true,
    "depth": 3
  },
  {
    "name": "Main navigation",
    "role": "navigation",
    "text": "Workspace\n⌄\nOverview\nActivity log\nSign-in sandbox\nForms & Inputs\n⌄\nRecords & Tables\n⌄\nComponents\n⌄\nFiles & Media\n⌄\nWorkflows\n⌄\nSettings\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 3
  },
  {
    "name": "Workspace\n⌄",
    "role": "button",
    "testId": "nav-workspace",
    "text": "Workspace\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Overview",
    "role": "link",
    "testId": "nav-workspace-overview",
    "text": "Overview",
    "visible": true,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Activity log",
    "role": "link",
    "testId": "nav-workspace-activity",
    "text": "Activity log",
    "visible": true,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Sign-in sandbox",
    "role": "link",
    "testId": "nav-workspace-session",
    "text": "Sign-in sandbox",
    "visible": true,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Forms & Inputs\n⌄",
    "role": "button",
    "testId": "nav-forms",
    "text": "Forms & Inputs\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Registration form",
    "role": "link",
    "testId": "nav-forms-registration",
    "text": "Registration form",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Input laboratory",
    "role": "link",
    "testId": "nav-forms-input-lab",
    "text": "Input laboratory",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Validation & editor",
    "role": "link",
    "testId": "nav-forms-validation",
    "text": "Validation & editor",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Records & Tables\n⌄",
    "role": "button",
    "testId": "nav-records",
    "text": "Records & Tables\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Customers",
    "role": "link",
    "testId": "nav-records-customers",
    "text": "Customers",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Orders",
    "role": "link",
    "testId": "nav-records-orders",
    "text": "Orders",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Advanced data grid",
    "role": "link",
    "testId": "nav-records-grid",
    "text": "Advanced data grid",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Components\n⌄",
    "role": "button",
    "testId": "nav-components",
    "text": "Components\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Buttons & menus",
    "role": "link",
    "testId": "nav-components-actions",
    "text": "Buttons & menus",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Dialogs & overlays",
    "role": "link",
    "testId": "nav-components-overlays",
    "text": "Dialogs & overlays",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Tabs, tree & accordion",
    "role": "link",
    "testId": "nav-components-structure",
    "text": "Tabs, tree & accordion",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Files & Media\n⌄",
    "role": "button",
    "testId": "nav-files",
    "text": "Files & Media\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Upload center",
    "role": "link",
    "testId": "nav-files-uploads",
    "text": "Upload center",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Downloads & exports",
    "role": "link",
    "testId": "nav-files-downloads",
    "text": "Downloads & exports",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Frames & media",
    "role": "link",
    "testId": "nav-files-preview",
    "text": "Frames & media",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Workflows\n⌄",
    "role": "button",
    "testId": "nav-workflows",
    "text": "Workflows\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Task board",
    "role": "link",
    "testId": "nav-workflows-board",
    "text": "Task board",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Order wizard",
    "role": "link",
    "testId": "nav-workflows-wizard",
    "text": "Order wizard",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Async & recovery",
    "role": "link",
    "testId": "nav-workflows-requests",
    "text": "Async & recovery",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Settings\n⌄",
    "role": "button",
    "testId": "nav-settings",
    "text": "Settings\n⌄",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Preferences",
    "role": "link",
    "testId": "nav-settings-preferences",
    "text": "Preferences",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Windows & connections",
    "role": "link",
    "testId": "nav-settings-connections",
    "text": "Windows & connections",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Runtime & test data",
    "role": "link",
    "testId": "nav-settings-runtime",
    "text": "Runtime & test data",
    "visible": false,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Component guide\n↗",
    "role": "button",
    "text": "Component guide\n↗",
    "visible": true,
    "enabled": true,
    "depth": 4
  },
  {
    "name": "Search pages",
    "role": "button",
    "text": "⌕\nJump to a page\nCtrl K",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Backend online",
    "testId": "backend-status",
    "text": "Backend online",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "YOUR QUALITY COMMAND CENTER\n\nA workspace built to be tested.\n\nAn isolated workspace for real desktop automation. Explore, interact, and verify.\n\n● LIVE BACKEND\nExplore components ↗",
    "role": "main",
    "text": "YOUR QUALITY COMMAND CENTER\n\nA workspace built to be tested.\n\nAn isolated workspace for real desktop automation. Explore, interact, and verify.\n\n● LIVE BACKEND\nExplore components ↗\nMain menus\n◫\n7\n21 submenu pages\nControl patterns\n◈\n50+\nHTML and custom controls\nCustomer records\n♧\n18\nCRUD with local p",
    "visible": true,
    "enabled": true,
    "depth": 3
  },
  {
    "name": "A workspace built to be tested.",
    "role": "heading",
    "testId": "page-title",
    "text": "A workspace built to be tested.",
    "visible": true,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Explore components ↗",
    "role": "button",
    "text": "Explore components ↗",
    "visible": true,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Workspace activity",
    "role": "heading",
    "text": "Workspace activity",
    "visible": true,
    "enabled": true,
    "depth": 8
  },
  {
    "name": "Illustrative activity trend across seven days",
    "role": "img",
    "text": "",
    "visible": true,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "Explore the surface",
    "role": "heading",
    "text": "Explore the surface",
    "visible": true,
    "enabled": true,
    "depth": 8
  },
  {
    "name": "Choose a testing surface",
    "role": "heading",
    "text": "Choose a testing surface",
    "visible": true,
    "enabled": true,
    "depth": 6
  },
  {
    "name": "↗\nForm controls\n\nText, choice, date, range, and validation.\n\n3 interactive surfaces",
    "role": "link",
    "text": "↗\nForm controls\n\nText, choice, date, range, and validation.\n\n3 interactive surfaces",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "↗\nRecords & tables\n\nCreate, edit, filter, sort, and paginate.\n\nPersistent CRUD workflows",
    "role": "link",
    "text": "↗\nRecords & tables\n\nCreate, edit, filter, sort, and paginate.\n\nPersistent CRUD workflows",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "↗\nUI components\n\nMenus, dialogs, tabs, trees, and overlays.\n\nNative + renderer controls",
    "role": "link",
    "text": "↗\nUI components\n\nMenus, dialogs, tabs, trees, and overlays.\n\nNative + renderer controls",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "↗\nFiles & media\n\nUpload assets and verify real exports.\n\nFiles, frames, shadow DOM",
    "role": "link",
    "text": "↗\nFiles & media\n\nUpload assets and verify real exports.\n\nFiles, frames, shadow DOM",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "↗\nConnected workflows\n\nMove tasks and complete a guided order.\n\nAsync and error recovery",
    "role": "link",
    "text": "↗\nConnected workflows\n\nMove tasks and complete a guided order.\n\nAsync and error recovery",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "↗\nDesktop connections\n\nInspect runtimes and multiple windows.\n\nLaunch, CDP, Windows UIA",
    "role": "link",
    "text": "↗\nDesktop connections\n\nInspect runtimes and multiple windows.\n\nLaunch, CDP, Windows UIA",
    "visible": true,
    "enabled": true,
    "depth": 5
  },
  {
    "name": "Recent activity",
    "role": "heading",
    "text": "Recent activity",
    "visible": true,
    "enabled": true,
    "depth": 7
  },
  {
    "name": "",
    "role": "status",
    "testId": "page-result",
    "text": "",
    "visible": false,
    "enabled": true,
    "depth": 4
  },
  {
    "name": "Ready for testing",
    "testId": "command-status",
    "text": "Ready for testing",
    "visible": true,
    "enabled": true,
    "depth": 4
  }
]

## Cross-layer scope

- LAB01 — Packaged Workspace has seven groups with three working subpages each: electron, api
- LAB02 — Registration rejects missing name/email/terms and records a backend submission: electron, api
- LAB03 — Dates, multiple selection, keyboard slider and framework expose submitted values: electron
- LAB04 — Project format, team boundaries, password length and confirmation are enforced: electron
- LAB05 — Customers create, edit, search, persist and delete across UI and REST: electron, api
- LAB06 — Grid selects five of eighteen records and paginates to the final three: electron
- LAB07 — Native JSON export reports a real path and Compact changes renderer state: electron
- LAB08 — DOM File action, double click and disabled button preserve explicit behavior: electron
- LAB09 — Note dialog cancels without saving and saves only the submitted note: electron
- LAB10 — Tabs change visible panels and expanded tree selects Reports: electron
- LAB11 — Same-origin iframe and open shadow forms retain independent feedback: electron
- LAB12 — Invalid credentials reject; login, session read, logout and post-logout denial work: electron
- LAB13 — Wizard validates all three stages and persists the resulting order: electron, api
- LAB14 — HTTP 503 error is reported, Success recovers and delayed content becomes ready: electron, api
- LAB15 — Uniquely titled Inspector stores its own note and returns to Workspace: electron
- LAB16 — API-created synthetic customer is exactly one matching renderer row: electron, api
- SUP01 — Upload/download API returns identical bytes and renderer lists the real file: electron, api
- SUP02 — Task keyboard alternative creates and moves a persistent task: electron, api
- SUP03 — Tooltip, popover, progress, meter and accessible canvas have observable results: electron, api
- SUP04 — Rich text value appears in valid project result: electron
- SUP05 — Preferences save real theme, compact mode, locale and notification values: electron, api
- SUP06 — A new owned launch reads persisted preferences, customer and order: electron, api
- SUP07 — Command search and activity filtering expose specific results: electron
- SUP08 — Slow request can cancel and then recover successfully: electron
- SAFE01 — Test-mode reset requires confirmation, cancellation preserves data, confirmed reset restores seed: electron, api
- SAFE02 — Without --test-mode, UI/native reset are unavailable and backend reset returns 403: electron, api

## API document provenance

No structured API catalog linked.

## Execution policy

```json
{
  "dos": [
    "Use synthetic records only. Every execution starts a new owned data directory. Test-mode reset is restricted to that directory."
  ],
  "donts": [
    "Do not reset the normal user profile. Healing must stay off. Do not create or approve visual baselines. Do not disable Electron context isolation, sandboxing or web security."
  ],
  "allowedOrigins": [
    "http://127.0.0.1:49724",
    "http://127.0.0.1:49725"
  ],
  "allowedMethods": [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ],
  "deniedTargets": [],
  "deniedUiActions": [],
  "captureScreenshots": true,
  "redactKeys": [
    "password",
    "token",
    "passphrase",
    "confirm"
  ]
}
```

Structured restrictions are enforced by schemaVersion 2 execution. Natural-language do/don't notes must be translated into supported restrictions and explicit assertions; unresolved rules need review.
