# InfiComponent Lab acceptance 20261104-acceptance

Execute the supplied LAB01-LAB16 acceptance requirements against the unmodified packaged EXE using C:/InfiAutomation 0.5.0; record detailed steps, real state assertions and explicit supplementary gaps.

Target: mixed

## Source documents

- reports/acceptance-20261104-acceptance/requirements.md (SHA-256 1fb3f3ad4746e6a592efbcdfecfd73c34fc90002c9f9ac94fcfd2cdfd35feee6)

## Requirements

- **LAB01** An owned packaged Electron launch opens the unique Workspace title and seven main navigation menu groups, each with three subpages.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: An owned packaged Electron launch opens the unique Workspace title and seven main navigation menu groups, each with three subpages.
- **LAB02** Registration rejects missing required fields and saves a valid name, email and terms acceptance through the backend, displaying the submitted name.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Registration rejects missing required fields and saves a valid name, email and terms acceptance through the backend, displaying the submitted name.
- **LAB03** Input controls expose observable values, including a keyboard-controlled slider, dates, multiple selection and a custom framework combobox.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Input controls expose observable values, including a keyboard-controlled slider, dates, multiple selection and a custom framework combobox.
- **LAB04** Project validation enforces ABC-123 format, team size 1–20, an eight-character passphrase and matching confirmation.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Project validation enforces ABC-123 format, team size 1–20, an eight-character passphrase and matching confirmation.
- **LAB05** Customers can be created, edited, searched and deleted through the renderer and persistent REST backend.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Customers can be created, edited, searched and deleted through the renderer and persistent REST backend.
- **LAB06** The advanced grid supports five-row selection and pagination over the eighteen seeded records.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: The advanced grid supports five-row selection and pagination over the eighteen seeded records.
- **LAB07** Native File > Export > Export JSON writes a JSON file and reports its path; native View > Compact mode toggles a real state.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Native File > Export > Export JSON writes a JSON file and reports its path; native View > Compact mode toggles a real state.
- **LAB08** An explicit DOM File menu saves a note, double click produces a result, and the disabled action stays disabled.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: An explicit DOM File menu saves a note, double click produces a result, and the disabled action stays disabled.
- **LAB09** Submitting the workspace note dialog displays the entered value. Cancelling closes it without saving.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Submitting the workspace note dialog displays the entered value. Cancelling closes it without saving.
- **LAB10** Tabs switch visible panels and expanding the project tree allows Reports to be selected.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Tabs switch visible panels and expanding the project tree allows Reports to be selected.
- **LAB11** A same-origin iframe form and an open shadow-root form save independent feedback values.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: A same-origin iframe form and an open shadow-root form save independent feedback values.
- **LAB12** Wrong credentials are rejected; tester@example.test / LabPass!2026 signs in; session read and logout work.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Wrong credentials are rejected; tester@example.test / LabPass!2026 signs in; session read and logout work.
- **LAB13** A three-step order workflow validates input and confirmation and creates a persistent order.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: A three-step order workflow validates input and confirmation and creates a persistent order.
- **LAB14** The intentional HTTP 503 scenario reports an error; switching to Success recovers; delayed content appears when ready.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: The intentional HTTP 503 scenario reports an error; switching to Success recovers; delayed content appears when ready.
- **LAB15** Inspector opens in a separate uniquely titled renderer with an independently saved note, and selection can return to Workspace.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Inspector opens in a separate uniquely titled renderer with an independently saved note, and selection can return to Workspace.
- **LAB16** A customer created through the REST API appears as one matching row in the renderer.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: A customer created through the REST API appears as one matching row in the renderer.
- **SUP01** Synthetic upload/download bytes and renderer file listing.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Synthetic upload/download bytes and renderer file listing.
- **SUP02** Task creation and keyboard-accessible lane transition.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Task creation and keyboard-accessible lane transition.
- **SUP03** Tooltip, popover, progress, meter, canvas equivalent and local audio asset.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Tooltip, popover, progress, meter, canvas equivalent and local audio asset.
- **SUP04** Editable rich text value.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Editable rich text value.
- **SUP05** Preference persistence across owned launches.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Preference persistence across owned launches.
- **SUP06** Command search and activity filtering.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Command search and activity filtering.
- **SUP07** Asynchronous request cancellation and recovery.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Asynchronous request cancellation and recovery.
- **SAFE01** Confirmed test-profile-only reset with cancellation.
  Source: reports/acceptance-20261104-acceptance/requirements.md
  - Acceptance: Confirmed test-profile-only reset with cancellation.
- **SAFE02** Reset is disabled and denied without --test-mode.
  Source: reports/acceptance-20261104-acceptance/requirements.md
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

1. Unique Workspace title
2. Expect 7 elements: .nav-group
3. Expect 3 elements: [data-testid^="nav-workspace-"]
4. Navigate > Workspace
5. Open workspace/overview
6. Expect page-title = A workspace built to be tested.
7. Navigate > Workspace
8. Open workspace/activity
9. Expect page-title = Activity log
10. Navigate > Workspace
11. Open workspace/session
12. Expect page-title = Sign-in sandbox
13. Expect 3 elements: [data-testid^="nav-forms-"]
14. Navigate > Forms
15. Open forms/registration
16. Expect page-title = Registration form
17. Navigate > Forms
18. Open forms/input-lab
19. Expect page-title = Input laboratory
20. Navigate > Forms
21. Open forms/validation
22. Expect page-title = Validation & editor
23. Expect 3 elements: [data-testid^="nav-records-"]
24. Navigate > Records
25. Open records/customers
26. Expect page-title = Customers
27. Navigate > Records
28. Open records/orders
29. Expect page-title = Orders
30. Navigate > Records
31. Open records/grid
32. Expect page-title = Advanced data grid
33. Expect 3 elements: [data-testid^="nav-components-"]
34. Navigate > Components
35. Open components/actions
36. Expect page-title = Buttons & menus
37. Navigate > Components
38. Open components/overlays
39. Expect page-title = Dialogs & overlays
40. Navigate > Components
41. Open components/structure
42. Expect page-title = Tabs, tree & accordion
43. Expect 3 elements: [data-testid^="nav-files-"]
44. Navigate > Files & Media
45. Open files/uploads
46. Expect page-title = Upload center
47. Navigate > Files & Media
48. Open files/downloads
49. Expect page-title = Downloads & exports
50. Navigate > Files & Media
51. Open files/preview
52. Expect page-title = Frames & media
53. Expect 3 elements: [data-testid^="nav-workflows-"]
54. Navigate > Workflows
55. Open workflows/board
56. Expect page-title = Task board
57. Navigate > Workflows
58. Open workflows/wizard
59. Expect page-title = Order wizard
60. Navigate > Workflows
61. Open workflows/requests
62. Expect page-title = Async & recovery
63. Expect 3 elements: [data-testid^="nav-settings-"]
64. Navigate > Settings
65. Open settings/preferences
66. Expect page-title = Preferences
67. Navigate > Settings
68. Open settings/connections
69. Expect page-title = Windows & connections
70. Navigate > Settings
71. Open settings/runtime
72. Expect page-title = Runtime & test data
73. Health identifies synthetic test-mode app

Expected: Unique Workspace title; Expect 7 elements: .nav-group; Expect 3 elements: [data-testid^="nav-workspace-"]; Expect page-title = A workspace built to be tested.; Expect page-title = Activity log; Expect page-title = Sign-in sandbox; Expect 3 elements: [data-testid^="nav-forms-"]; Expect page-title = Registration form; Expect page-title = Input laboratory; Expect page-title = Validation & editor; Expect 3 elements: [data-testid^="nav-records-"]; Expect page-title = Customers; Expect page-title = Orders; Expect page-title = Advanced data grid; Expect 3 elements: [data-testid^="nav-components-"]; Expect page-title = Buttons & menus; Expect page-title = Dialogs & overlays; Expect page-title = Tabs, tree & accordion; Expect 3 elements: [data-testid^="nav-files-"]; Expect page-title = Upload center; Expect page-title = Downloads & exports; Expect page-title = Frames & media; Expect 3 elements: [data-testid^="nav-workflows-"]; Expect page-title = Task board; Expect page-title = Order wizard; Expect page-title = Async & recovery; Expect 3 elements: [data-testid^="nav-settings-"]; Expect page-title = Preferences; Expect page-title = Windows & connections; Expect page-title = Runtime & test data; Health identifies synthetic test-mode app

### TC-002 - LAB02 — Registration rejects missing name/email/terms and records a backend submission

Priority: high | Requirements: LAB02

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Forms
2. Open forms/registration
3. Expect page-title = Registration form
4. Click Save registration
5. Expect page-result = required fields
6. Fill Full name *
7. Click Save registration
8. Expect page-result = required fields
9. Fill Email *
10. Check I accept the demo terms (required)
11. Click Save registration
12. Expect page-result = required fields
13. Fill Email *
14. Uncheck I accept the demo terms (required)
15. Click Save registration
16. Expect page-result = required fields
17. Backend independently rejects missing terms
18. Check I accept the demo terms (required)
19. Click Save registration
20. Expect page-result = Registration saved for Acceptance Tester
21. Submission produced a persisted form event

Expected: Expect page-title = Registration form; Expect page-result = required fields; Expect page-result = required fields; Expect page-result = required fields; Expect page-result = required fields; Backend independently rejects missing terms; Expect page-result = Registration saved for Acceptance Tester; Submission produced a persisted form event

### TC-003 - LAB03 — Dates, multiple selection, keyboard slider and framework expose submitted values

Priority: high | Requirements: LAB03

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Forms
2. Open forms/input-lab
3. Expect page-title = Input laboratory
4. Fill Quantity
5. Fill Start date
6. Fill Start time
7. Fill Meeting date and time
8. Fill Reporting month
9. Fill Reporting week
10. Press Home in Confidence
11. Expect Confidence value
12. Press End in Confidence
13. Expect Confidence value
14. Select Skills (multiple selection) = Playwright
15. Press Shift+ArrowDown in Skills (multiple selection)
16. Expect 2 elements: select[name="skills"] option:checked
17. Fill Test framework
18. Choose observed framework
19. Expect Test framework value
20. Click Read input values
21. Expect input-values = "quantity": "9"
22. Expect input-values = "date": "2026-11-15"
23. Expect input-values = "time": "14:45"
24. Expect input-values = "datetime": "2026-11-15T14:45"
25. Expect input-values = "month": "2026-12"
26. Expect input-values = "week": "2026-W47"
27. Expect input-values = "confidence": "100"
28. Expect input-values = "Playwright"
29. Expect input-values = "Electron"
30. Expect input-values = "framework": "InfiAutomation"

Expected: Expect page-title = Input laboratory; Expect Confidence value; Expect Confidence value; Expect 2 elements: select[name="skills"] option:checked; Expect Test framework value; Expect input-values = "quantity": "9"; Expect input-values = "date": "2026-11-15"; Expect input-values = "time": "14:45"; Expect input-values = "datetime": "2026-11-15T14:45"; Expect input-values = "month": "2026-12"; Expect input-values = "week": "2026-W47"; Expect input-values = "confidence": "100"; Expect input-values = "Playwright"; Expect input-values = "Electron"; Expect input-values = "framework": "InfiAutomation"

### TC-004 - LAB04 — Project format, team boundaries, password length and confirmation are enforced

Priority: high | Requirements: LAB04

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Forms
2. Open forms/validation
3. Expect page-title = Validation & editor
4. Click Validate project
5. Expect page-result = Check project code
6. Fill Project code
7. Fill Secure passphrase
8. Fill Confirm passphrase
9. Click Validate project
10. Expect page-result = Check project code
11. Fill Project code
12. Click Validate project
13. Expect page-result = Check project code
14. Fill Project code
15. Fill Team size
16. Click Validate project
17. Expect page-result = Check project code
18. Fill Team size
19. Click Validate project
20. Expect page-result = Check project code
21. Fill Team size
22. Fill Secure passphrase
23. Fill Confirm passphrase
24. Click Validate project
25. Expect page-result = Check project code
26. Fill Secure passphrase
27. Fill Confirm passphrase
28. Click Validate project
29. Expect page-result = Passphrases do not match.
30. Fill Confirm passphrase
31. Click Validate project
32. Expect page-result = Project ABC-123 is valid.
33. Fill Team size
34. Click Validate project
35. Expect page-result = Project ABC-123 is valid.

Expected: Expect page-title = Validation & editor; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Check project code; Expect page-result = Passphrases do not match.; Expect page-result = Project ABC-123 is valid.; Expect page-result = Project ABC-123 is valid.

### TC-005 - LAB05 — Customers create, edit, search, persist and delete across UI and REST

Priority: high | Requirements: LAB05

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Records
2. Open records/customers
3. Expect page-title = Customers
4. Click + Add customer
5. Fill Customer name
6. Fill Email address
7. Click Create customer
8. Fill Search customers
9. Expect 1 elements: [data-testid="customer-row"]
10. Created customer exists in REST
11. Navigate > Workspace
12. Open workspace/overview
13. Expect page-title = A workspace built to be tested.
14. Navigate > Records
15. Open records/customers
16. Expect page-title = Customers
17. Fill Search customers
18. Expect 1 elements: [data-testid="customer-row"]
19. Click Edit Acceptance Customer
20. Fill Customer name
21. Click Save changes
22. Edited customer persisted
23. Fill Search customers
24. Expect 1 elements: [data-testid="customer-row"]
25. Click Delete Acceptance Updated
26. Click Delete customer
27. Fill Search customers
28. Expect empty-customers = No customers match your filters.
29. Deleted customer is absent

Expected: Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]; Created customer exists in REST; Expect page-title = A workspace built to be tested.; Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]; Edited customer persisted; Expect 1 elements: [data-testid="customer-row"]; Expect empty-customers = No customers match your filters.; Deleted customer is absent

### TC-006 - LAB06 — Grid selects five of eighteen records and paginates to the final three

Priority: high | Requirements: LAB06

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Records
2. Open records/grid
3. Expect page-title = Advanced data grid
4. Expect .pagination text
5. Expect 5 elements: #grid-table tbody tr
6. Check Select current page
7. Expect #selection-count text
8. Click Next page
9. Expect .pagination text
10. Expect #selection-count text
11. Click Next page
12. Click Next page
13. Expect .pagination text
14. Expect 3 elements: #grid-table tbody tr
15. Expected enabled=false: Next page
16. Click Previous page
17. Expect .pagination text

Expected: Expect page-title = Advanced data grid; Expect .pagination text; Expect 5 elements: #grid-table tbody tr; Expect #selection-count text; Expect .pagination text; Expect #selection-count text; Expect .pagination text; Expect 3 elements: #grid-table tbody tr; Expected enabled=false: Next page; Expect .pagination text

### TC-007 - LAB07 — Native JSON export reports a real path and Compact changes renderer state

Priority: high | Requirements: LAB07

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. File > Export > Export JSON
2. Expect command-status = C:/InfiComponentLab\.runtime\acceptance-execution-20261104-acceptance-1793785983110\lab-data\infi-lab-export.json
3. View > Compact mode
4. Expect command-status = Compact mode on
5. Expect 1 elements: body.compact
6. View > Compact mode
7. Expect command-status = Compact mode off
8. Expect 0 elements: body.compact

Expected: Expect command-status = C:/InfiComponentLab\.runtime\acceptance-execution-20261104-acceptance-1793785983110\lab-data\infi-lab-export.json; Expect command-status = Compact mode on; Expect 1 elements: body.compact; Expect command-status = Compact mode off; Expect 0 elements: body.compact

### TC-008 - LAB08 — DOM File action, double click and disabled button preserve explicit behavior

Priority: high | Requirements: LAB08

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Components
2. Open components/actions
3. Expect page-title = Buttons & menus
4. Explicit DOM File > Save note
5. Expect page-result = DOM note saved
6. Double click
7. Expect page-result = Double-click detected
8. Disabled remains disabled

Expected: Expect page-title = Buttons & menus; Expect page-result = DOM note saved; Expect page-result = Double-click detected; Disabled remains disabled

### TC-009 - LAB09 — Note dialog cancels without saving and saves only the submitted note

Priority: high | Requirements: LAB09

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Components
2. Open components/overlays
3. Expect page-title = Dialogs & overlays
4. Click Open modal
5. Fill Workspace note
6. Click Cancel
7. Expect 0 elements: #app-dialog[open]
8. Expect 0 elements: [data-testid="page-result"]:not([hidden])
9. Click Open modal
10. Fill Workspace note
11. Click Save note
12. Expect 0 elements: #app-dialog[open]
13. Expect page-result = Note saved: Acceptance saved note
14. Click Open modal
15. Fill Workspace note
16. Click Cancel
17. Expect 0 elements: #app-dialog[open]
18. Expect page-result = Note saved: Acceptance saved note

Expected: Expect page-title = Dialogs & overlays; Expect 0 elements: #app-dialog[open]; Expect 0 elements: [data-testid="page-result"]:not([hidden]); Expect 0 elements: #app-dialog[open]; Expect page-result = Note saved: Acceptance saved note; Expect 0 elements: #app-dialog[open]; Expect page-result = Note saved: Acceptance saved note

### TC-010 - LAB10 — Tabs change visible panels and expanded tree selects Reports

Priority: high | Requirements: LAB10

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Components
2. Open components/structure
3. Expect page-title = Tabs, tree & accordion
4. Open Details
5. Expect 1 elements: #tab-panel-1:not([hidden])
6. Expect 1 elements: #tab-panel-0[hidden]
7. Open History
8. Expect 1 elements: #tab-panel-2:not([hidden])
9. Expand project
10. Select Reports
11. Expect page-result = Tree selected: Reports
12. Expect 1 elements: [role="treeitem"][aria-selected="true"][data-tree-leaf="Reports"]

Expected: Expect page-title = Tabs, tree & accordion; Expect 1 elements: #tab-panel-1:not([hidden]); Expect 1 elements: #tab-panel-0[hidden]; Expect 1 elements: #tab-panel-2:not([hidden]); Expect page-result = Tree selected: Reports; Expect 1 elements: [role="treeitem"][aria-selected="true"][data-tree-leaf="Reports"]

### TC-011 - LAB11 — Same-origin iframe and open shadow forms retain independent feedback

Priority: high | Requirements: LAB11

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Files & Media
2. Open files/preview
3. Expect page-title = Frames & media
4. Frame feedback
5. Save frame
6. Frame saved
7. Shadow feedback
8. Click Save shadow feedback
9. Expect shadow-output = Shadow saved: Acceptance shadow
10. Frame remains independent

Expected: Expect page-title = Frames & media; Frame saved; Expect shadow-output = Shadow saved: Acceptance shadow; Frame remains independent

### TC-012 - LAB12 — Invalid credentials reject; login, session read, logout and post-logout denial work

Priority: high | Requirements: LAB12

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Workspace
2. Open workspace/session
3. Expect page-title = Sign-in sandbox
4. Fill Account email
5. Fill Account password
6. Click Sign in
7. Expect page-result = incorrect
8. Fill Account password
9. Click Sign in
10. Expect session-user = Signed in as Alex Morgan
11. Click Check session
12. Expect page-result = Session is active
13. Click Sign out
14. Expect session-user = Signed out
15. Click Check session
16. Expect page-result = Sign in to continue

Expected: Expect page-title = Sign-in sandbox; Expect page-result = incorrect; Expect session-user = Signed in as Alex Morgan; Expect page-result = Session is active; Expect session-user = Signed out; Expect page-result = Sign in to continue

### TC-013 - LAB13 — Wizard validates all three stages and persists the resulting order

Priority: high | Requirements: LAB13

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Workflows
2. Open workflows/wizard
3. Expect page-title = Order wizard
4. Click Continue
5. Expect 1 elements: #wizard-form select[name="customer"]
6. Select Order customer = Aarav Shah
7. Click Continue
8. Fill Order amount
9. Click Continue
10. Expect 1 elements: #wizard-form input[name="amount"]
11. Fill Order amount
12. Click Continue
13. Expect order-review = Customer: Aarav Shah
14. Click Place order
15. Expect 1 elements: #wizard-form input[name="confirmed"]:not(:checked)
16. No order without confirmation
17. Check I confirm this demo order
18. Click Place order
19. Expect order-success = created for Aarav Shah
20. Order exists in persisted backend
21. Click View orders
22. Expect page-title = Orders
23. Expect #order-table tbody tr:first-child text
24. Expect #order-table tbody tr:first-child text

Expected: Expect page-title = Order wizard; Expect 1 elements: #wizard-form select[name="customer"]; Expect 1 elements: #wizard-form input[name="amount"]; Expect order-review = Customer: Aarav Shah; Expect 1 elements: #wizard-form input[name="confirmed"]:not(:checked); No order without confirmation; Expect order-success = created for Aarav Shah; Order exists in persisted backend; Expect page-title = Orders; Expect #order-table tbody tr:first-child text; Expect #order-table tbody tr:first-child text

### TC-014 - LAB14 — HTTP 503 error is reported, Success recovers and delayed content becomes ready

Priority: high | Requirements: LAB14

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Workflows
2. Open workflows/requests
3. Expect page-title = Async & recovery
4. Intentional error is actual HTTP 503
5. Select Response scenario = Server error
6. Click Send request
7. Expect request-response = Intentional lab error
8. Select Response scenario = Success
9. Click Send request
10. Expect request-response = Request completed successfully
11. Click Load delayed content
12. Expect delayed-result = Delayed content is ready

Expected: Expect page-title = Async & recovery; Intentional error is actual HTTP 503; Expect request-response = Intentional lab error; Expect request-response = Request completed successfully; Expect delayed-result = Delayed content is ready

### TC-015 - LAB15 — Uniquely titled Inspector stores its own note and returns to Workspace

Priority: high | Requirements: LAB15

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Tools > Open Inspector
2. Select Inspector
3. Inspector unique title
4. Fill Inspector note
5. Click Save inspector note
6. Expect inspector-result = Inspector saved: Acceptance independent note
7. Select Workspace
8. Workspace title
9. Expect 0 elements: [data-testid="inspector-result"]
10. Return Inspector retains note
11. Expect inspector-result = Inspector saved: Acceptance independent note
12. Return Workspace

Expected: Inspector unique title; Expect inspector-result = Inspector saved: Acceptance independent note; Workspace title; Expect 0 elements: [data-testid="inspector-result"]; Expect inspector-result = Inspector saved: Acceptance independent note

### TC-016 - LAB16 — API-created synthetic customer is exactly one matching renderer row

Priority: high | Requirements: LAB16

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Start owned app before REST
2. Create REST customer
3. Navigate > Records
4. Open records/customers
5. Expect page-title = Customers
6. Fill Search customers
7. Expect 1 elements: [data-testid="customer-row"]
8. Expect [data-testid="customer-row"] text
9. Expect [data-testid="customer-row"] text

Expected: Start owned app before REST; Create REST customer; Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]; Expect [data-testid="customer-row"] text; Expect [data-testid="customer-row"] text

### TC-017 - SUP01 — Upload/download API returns identical bytes and renderer lists the real file

Priority: normal | Requirements: SUP01

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Start app
2. Upload synthetic bytes
3. Download identical bytes
4. Navigate > Files & Media
5. Open files/uploads
6. Expect page-title = Upload center
7. Expect #uploaded-files text
8. Expect 1 elements: #uploaded-files a[download="acceptance.txt"]

Expected: Start app; Upload synthetic bytes; Download identical bytes; Expect page-title = Upload center; Expect #uploaded-files text; Expect 1 elements: #uploaded-files a[download="acceptance.txt"]

### TC-018 - SUP02 — Task keyboard alternative creates and moves a persistent task

Priority: normal | Requirements: SUP02

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Workflows
2. Open workflows/board
3. Expect page-title = Task board
4. Fill New task title
5. Click + Add task
6. Select Move Acceptance keyboard task = Done
7. Expect page-result = Task moved to Done
8. Expect Move Acceptance keyboard task value
9. Task move persisted

Expected: Expect page-title = Task board; Expect page-result = Task moved to Done; Expect Move Acceptance keyboard task value; Task move persisted

### TC-019 - SUP03 — Tooltip, popover, progress, meter and accessible canvas have observable results

Priority: normal | Requirements: SUP03

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Components
2. Open components/actions
3. Expect page-title = Buttons & menus
4. Hover observed tooltip trigger
5. Tooltip visible
6. Navigate > Components
7. Open components/overlays
8. Expect page-title = Dialogs & overlays
9. Click Open popover
10. Expect 1 elements: #details-popover:popover-open
11. Click Close popover
12. Expect 0 elements: #details-popover:popover-open
13. Navigate > Components
14. Open components/structure
15. Expect page-title = Tabs, tree & accordion
16. Click Advance progress
17. Expect 1 elements: #demo-progress[value="50"]
18. Expect 1 elements: meter[value="62"]
19. Navigate > Files & Media
20. Open files/preview
21. Expect page-title = Frames & media
22. Click Change canvas signal
23. Expect #canvas-result text
24. Local audio asset exists

Expected: Expect page-title = Buttons & menus; Tooltip visible; Expect page-title = Dialogs & overlays; Expect 1 elements: #details-popover:popover-open; Expect 0 elements: #details-popover:popover-open; Expect page-title = Tabs, tree & accordion; Expect 1 elements: #demo-progress[value="50"]; Expect 1 elements: meter[value="62"]; Expect page-title = Frames & media; Expect #canvas-result text; Local audio asset exists

### TC-020 - SUP04 — Rich text value appears in valid project result

Priority: normal | Requirements: SUP04

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Forms
2. Open forms/validation
3. Expect page-title = Validation & editor
4. Fill Project code
5. Fill Secure passphrase
6. Fill Confirm passphrase
7. Fill Release notes
8. Click Validate project
9. Expect page-result = Release notes: Acceptance rich text note

Expected: Expect page-title = Validation & editor; Expect page-result = Release notes: Acceptance rich text note

### TC-021 - SUP05 — Preferences save real theme, compact mode, locale and notification values

Priority: normal | Requirements: SUP05

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Settings
2. Open settings/preferences
3. Expect page-title = Preferences
4. Select Theme = dark
5. Select Locale = en-GB
6. Check Compact table rows
7. Uncheck Workspace notifications
8. Click Save preferences
9. Expect page-result = Preferences saved
10. Expect 1 elements: body.dark.compact
11. Preferences persisted in backend

Expected: Expect page-title = Preferences; Expect page-result = Preferences saved; Expect 1 elements: body.dark.compact; Preferences persisted in backend

### TC-022 - SUP06 — A new owned launch reads persisted preferences, customer and order

Priority: normal | Requirements: SUP05, LAB05, LAB13, LAB16

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Settings
2. Open settings/preferences
3. Expect page-title = Preferences
4. Expect Theme value
5. Expect Locale value
6. Compact preference persists
7. Expect 1 elements: body.dark.compact
8. Order persisted across launch
9. Navigate > Records
10. Open records/customers
11. Expect page-title = Customers
12. Fill Search customers
13. Expect 1 elements: [data-testid="customer-row"]

Expected: Expect page-title = Preferences; Expect Theme value; Expect Locale value; Compact preference persists; Expect 1 elements: body.dark.compact; Order persisted across launch; Expect page-title = Customers; Expect 1 elements: [data-testid="customer-row"]

### TC-023 - SUP07 — Command search and activity filtering expose specific results

Priority: normal | Requirements: SUP06

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Click Search pages
2. Fill Search pages
3. Choose observed page search result
4. Expect page-title = Registration form
5. Navigate > Workspace
6. Open workspace/activity
7. Expect page-title = Activity log
8. Fill Filter events
9. Expect 1 elements: #event-list .activity-item
10. Expect #event-list text
11. Fill Filter events
12. Expect 0 elements: #event-list .activity-item

Expected: Expect page-title = Registration form; Expect page-title = Activity log; Expect 1 elements: #event-list .activity-item; Expect #event-list text; Expect 0 elements: #event-list .activity-item

### TC-024 - SUP08 — Slow request can cancel and then recover successfully

Priority: normal | Requirements: SUP07

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Workflows
2. Open workflows/requests
3. Expect page-title = Async & recovery
4. Select Response scenario = Slow response
5. Click Send request
6. Click Cancel request
7. Expect request-response = Request cancelled
8. Expected enabled=true: Send request
9. Expected enabled=false: Cancel request
10. Select Response scenario = Success
11. Click Send request
12. Expect request-response = Request completed successfully

Expected: Expect page-title = Async & recovery; Expect request-response = Request cancelled; Expected enabled=true: Send request; Expected enabled=false: Cancel request; Expect request-response = Request completed successfully

### TC-025 - SAFE01 — Test-mode reset requires confirmation, cancellation preserves data, confirmed reset restores seed

Priority: normal | Requirements: SAFE01

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Settings
2. Open settings/runtime
3. Expect page-title = Runtime & test data
4. Click Reset test data
5. Click Cancel
6. Cancelled reset preserved synthetic customer
7. Click Reset test data
8. Click Reset data
9. Reset modal closed
10. Confirmed reset restores all seeded state

Expected: Expect page-title = Runtime & test data; Cancelled reset preserved synthetic customer; Reset modal closed; Confirmed reset restores all seeded state

### TC-026 - SAFE02 — Without --test-mode, UI/native reset are unavailable and backend reset returns 403

Priority: normal | Requirements: SAFE02

Preconditions: New isolated run profile; cases execute sequentially. State deliberately persists between owned launches within this run.; LAB01-LAB06 run before the cross-layer customer is added; SAFE01 reset runs only after persistence checks.

1. Navigate > Settings
2. Open settings/runtime
3. Expect page-title = Runtime & test data
4. Expected enabled=false: Reset test data
5. Backend rejects reset outside test mode

Expected: Expect page-title = Runtime & test data; Expected enabled=false: Reset test data; Backend rejects reset outside test mode

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
    "http://127.0.0.1:54972",
    "http://127.0.0.1:54973"
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
