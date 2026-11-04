# InfiComponent Lab — executed test cases

## LAB01 — Packaged Workspace has seven groups with three working subpages each

Outcome: passed. Requirements: LAB01.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Unique Workspace title
   {"name":"Unique Workspace title","action":"assertTitle","value":"InfiComponent Lab - Workspace","contains":false}
3. Expect 7 elements: .nav-group
   {"name":"Expect 7 elements: .nav-group","action":"assertCount","locator":{"css":".nav-group"},"value":7,"contains":false}
4. Expect 3 elements: [data-testid^="nav-workspace-"]
   {"name":"Expect 3 elements: [data-testid^=\"nav-workspace-\"]","action":"assertCount","locator":{"css":"[data-testid^=\"nav-workspace-\"]"},"value":3,"contains":false}
5. Navigate > Workspace
   {"name":"Navigate > Workspace","action":"menu","contains":false,"menuPath":["Navigate","Workspace"],"menuSource":"native"}
6. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
7. Open workspace/overview
   {"name":"Open workspace/overview","action":"click","locator":{"testId":"nav-workspace-overview"},"contains":false}
8. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
9. Navigate > Workspace
   {"name":"Navigate > Workspace","action":"menu","contains":false,"menuPath":["Navigate","Workspace"],"menuSource":"native"}
10. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
11. Open workspace/activity
   {"name":"Open workspace/activity","action":"click","locator":{"testId":"nav-workspace-activity"},"contains":false}
12. Expect page-title = Activity log
   {"name":"Expect page-title = Activity log","action":"assertText","locator":{"testId":"page-title"},"value":"Activity log","contains":false}
13. Navigate > Workspace
   {"name":"Navigate > Workspace","action":"menu","contains":false,"menuPath":["Navigate","Workspace"],"menuSource":"native"}
14. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
15. Open workspace/session
   {"name":"Open workspace/session","action":"click","locator":{"testId":"nav-workspace-session"},"contains":false}
16. Expect page-title = Sign-in sandbox
   {"name":"Expect page-title = Sign-in sandbox","action":"assertText","locator":{"testId":"page-title"},"value":"Sign-in sandbox","contains":false}
17. Expect 3 elements: [data-testid^="nav-forms-"]
   {"name":"Expect 3 elements: [data-testid^=\"nav-forms-\"]","action":"assertCount","locator":{"css":"[data-testid^=\"nav-forms-\"]"},"value":3,"contains":false}
18. Navigate > Forms
   {"name":"Navigate > Forms","action":"menu","contains":false,"menuPath":["Navigate","Forms"],"menuSource":"native"}
19. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
20. Open forms/registration
   {"name":"Open forms/registration","action":"click","locator":{"testId":"nav-forms-registration"},"contains":false}
21. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
22. Navigate > Forms
   {"name":"Navigate > Forms","action":"menu","contains":false,"menuPath":["Navigate","Forms"],"menuSource":"native"}
23. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
24. Open forms/input-lab
   {"name":"Open forms/input-lab","action":"click","locator":{"testId":"nav-forms-input-lab"},"contains":false}
25. Expect page-title = Input laboratory
   {"name":"Expect page-title = Input laboratory","action":"assertText","locator":{"testId":"page-title"},"value":"Input laboratory","contains":false}
26. Navigate > Forms
   {"name":"Navigate > Forms","action":"menu","contains":false,"menuPath":["Navigate","Forms"],"menuSource":"native"}
27. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
28. Open forms/validation
   {"name":"Open forms/validation","action":"click","locator":{"testId":"nav-forms-validation"},"contains":false}
29. Expect page-title = Validation & editor
   {"name":"Expect page-title = Validation & editor","action":"assertText","locator":{"testId":"page-title"},"value":"Validation & editor","contains":false}
30. Expect 3 elements: [data-testid^="nav-records-"]
   {"name":"Expect 3 elements: [data-testid^=\"nav-records-\"]","action":"assertCount","locator":{"css":"[data-testid^=\"nav-records-\"]"},"value":3,"contains":false}
31. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
32. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
33. Open records/customers
   {"name":"Open records/customers","action":"click","locator":{"testId":"nav-records-customers"},"contains":false}
34. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
35. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
36. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
37. Open records/orders
   {"name":"Open records/orders","action":"click","locator":{"testId":"nav-records-orders"},"contains":false}
38. Expect page-title = Orders
   {"name":"Expect page-title = Orders","action":"assertText","locator":{"testId":"page-title"},"value":"Orders","contains":false}
39. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
40. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
41. Open records/grid
   {"name":"Open records/grid","action":"click","locator":{"testId":"nav-records-grid"},"contains":false}
42. Expect page-title = Advanced data grid
   {"name":"Expect page-title = Advanced data grid","action":"assertText","locator":{"testId":"page-title"},"value":"Advanced data grid","contains":false}
43. Expect 3 elements: [data-testid^="nav-components-"]
   {"name":"Expect 3 elements: [data-testid^=\"nav-components-\"]","action":"assertCount","locator":{"css":"[data-testid^=\"nav-components-\"]"},"value":3,"contains":false}
44. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
45. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
46. Open components/actions
   {"name":"Open components/actions","action":"click","locator":{"testId":"nav-components-actions"},"contains":false}
47. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
48. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
49. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
50. Open components/overlays
   {"name":"Open components/overlays","action":"click","locator":{"testId":"nav-components-overlays"},"contains":false}
51. Expect page-title = Dialogs & overlays
   {"name":"Expect page-title = Dialogs & overlays","action":"assertText","locator":{"testId":"page-title"},"value":"Dialogs & overlays","contains":false}
52. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
53. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
54. Open components/structure
   {"name":"Open components/structure","action":"click","locator":{"testId":"nav-components-structure"},"contains":false}
55. Expect page-title = Tabs, tree & accordion
   {"name":"Expect page-title = Tabs, tree & accordion","action":"assertText","locator":{"testId":"page-title"},"value":"Tabs, tree & accordion","contains":false}
56. Expect 3 elements: [data-testid^="nav-files-"]
   {"name":"Expect 3 elements: [data-testid^=\"nav-files-\"]","action":"assertCount","locator":{"css":"[data-testid^=\"nav-files-\"]"},"value":3,"contains":false}
57. Navigate > Files & Media
   {"name":"Navigate > Files & Media","action":"menu","contains":false,"menuPath":["Navigate","Files & Media"],"menuSource":"native"}
58. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
59. Open files/uploads
   {"name":"Open files/uploads","action":"click","locator":{"testId":"nav-files-uploads"},"contains":false}
60. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
61. Navigate > Files & Media
   {"name":"Navigate > Files & Media","action":"menu","contains":false,"menuPath":["Navigate","Files & Media"],"menuSource":"native"}
62. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
63. Open files/downloads
   {"name":"Open files/downloads","action":"click","locator":{"testId":"nav-files-downloads"},"contains":false}
64. Expect page-title = Downloads & exports
   {"name":"Expect page-title = Downloads & exports","action":"assertText","locator":{"testId":"page-title"},"value":"Downloads & exports","contains":false}
65. Navigate > Files & Media
   {"name":"Navigate > Files & Media","action":"menu","contains":false,"menuPath":["Navigate","Files & Media"],"menuSource":"native"}
66. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
67. Open files/preview
   {"name":"Open files/preview","action":"click","locator":{"testId":"nav-files-preview"},"contains":false}
68. Expect page-title = Frames & media
   {"name":"Expect page-title = Frames & media","action":"assertText","locator":{"testId":"page-title"},"value":"Frames & media","contains":false}
69. Expect 3 elements: [data-testid^="nav-workflows-"]
   {"name":"Expect 3 elements: [data-testid^=\"nav-workflows-\"]","action":"assertCount","locator":{"css":"[data-testid^=\"nav-workflows-\"]"},"value":3,"contains":false}
70. Navigate > Workflows
   {"name":"Navigate > Workflows","action":"menu","contains":false,"menuPath":["Navigate","Workflows"],"menuSource":"native"}
71. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
72. Open workflows/board
   {"name":"Open workflows/board","action":"click","locator":{"testId":"nav-workflows-board"},"contains":false}
73. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
74. Navigate > Workflows
   {"name":"Navigate > Workflows","action":"menu","contains":false,"menuPath":["Navigate","Workflows"],"menuSource":"native"}
75. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
76. Open workflows/wizard
   {"name":"Open workflows/wizard","action":"click","locator":{"testId":"nav-workflows-wizard"},"contains":false}
77. Expect page-title = Order wizard
   {"name":"Expect page-title = Order wizard","action":"assertText","locator":{"testId":"page-title"},"value":"Order wizard","contains":false}
78. Navigate > Workflows
   {"name":"Navigate > Workflows","action":"menu","contains":false,"menuPath":["Navigate","Workflows"],"menuSource":"native"}
79. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
80. Open workflows/requests
   {"name":"Open workflows/requests","action":"click","locator":{"testId":"nav-workflows-requests"},"contains":false}
81. Expect page-title = Async & recovery
   {"name":"Expect page-title = Async & recovery","action":"assertText","locator":{"testId":"page-title"},"value":"Async & recovery","contains":false}
82. Expect 3 elements: [data-testid^="nav-settings-"]
   {"name":"Expect 3 elements: [data-testid^=\"nav-settings-\"]","action":"assertCount","locator":{"css":"[data-testid^=\"nav-settings-\"]"},"value":3,"contains":false}
83. Navigate > Settings
   {"name":"Navigate > Settings","action":"menu","contains":false,"menuPath":["Navigate","Settings"],"menuSource":"native"}
84. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
85. Open settings/preferences
   {"name":"Open settings/preferences","action":"click","locator":{"testId":"nav-settings-preferences"},"contains":false}
86. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
87. Navigate > Settings
   {"name":"Navigate > Settings","action":"menu","contains":false,"menuPath":["Navigate","Settings"],"menuSource":"native"}
88. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
89. Open settings/connections
   {"name":"Open settings/connections","action":"click","locator":{"testId":"nav-settings-connections"},"contains":false}
90. Expect page-title = Windows & connections
   {"name":"Expect page-title = Windows & connections","action":"assertText","locator":{"testId":"page-title"},"value":"Windows & connections","contains":false}
91. Navigate > Settings
   {"name":"Navigate > Settings","action":"menu","contains":false,"menuPath":["Navigate","Settings"],"menuSource":"native"}
92. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
93. Open settings/runtime
   {"name":"Open settings/runtime","action":"click","locator":{"testId":"nav-settings-runtime"},"contains":false}
94. Expect page-title = Runtime & test data
   {"name":"Expect page-title = Runtime & test data","action":"assertText","locator":{"testId":"page-title"},"value":"Runtime & test data","contains":false}
95. Health identifies synthetic test-mode app
   {"name":"Health identifies synthetic test-mode app","target":"api","kind":"api","method":"GET","path":"/api/health","headers":{},"expect":{"status":200,"checks":[{"path":"body.status","equals":"ok"},{"path":"body.testMode","equals":true}],"allowSoapFault":false},"capture":{}}

## LAB02 — Registration rejects missing name/email/terms and records a backend submission

Outcome: passed. Requirements: LAB02.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Forms
   {"name":"Navigate > Forms","action":"menu","contains":false,"menuPath":["Navigate","Forms"],"menuSource":"native"}
3. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
4. Open forms/registration
   {"name":"Open forms/registration","action":"click","locator":{"testId":"nav-forms-registration"},"contains":false}
5. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
6. Click Save registration
   {"name":"Click Save registration","action":"click","locator":{"role":"button","name":"Save registration"},"contains":false}
7. Expect page-result = required fields
   {"name":"Expect page-result = required fields","action":"assertText","locator":{"testId":"page-result"},"value":"required fields","contains":true}
8. Fill Full name *
   {"name":"Fill Full name *","action":"fill","locator":{"label":"Full name *"},"value":"Acceptance Tester","contains":false}
9. Click Save registration
   {"name":"Click Save registration","action":"click","locator":{"role":"button","name":"Save registration"},"contains":false}
10. Expect page-result = required fields
   {"name":"Expect page-result = required fields","action":"assertText","locator":{"testId":"page-result"},"value":"required fields","contains":true}
11. Fill Email *
   {"name":"Fill Email *","action":"fill","locator":{"label":"Email *"},"value":"invalid-email","contains":false}
12. Check I accept the demo terms (required)
   {"name":"Check I accept the demo terms (required)","action":"check","locator":{"label":"I accept the demo terms (required)"},"contains":false}
13. Click Save registration
   {"name":"Click Save registration","action":"click","locator":{"role":"button","name":"Save registration"},"contains":false}
14. Expect page-result = required fields
   {"name":"Expect page-result = required fields","action":"assertText","locator":{"testId":"page-result"},"value":"required fields","contains":true}
15. Fill Email *
   {"name":"Fill Email *","action":"fill","locator":{"label":"Email *"},"value":"acceptance@example.test","contains":false}
16. Uncheck I accept the demo terms (required)
   {"name":"Uncheck I accept the demo terms (required)","action":"uncheck","locator":{"label":"I accept the demo terms (required)"},"contains":false}
17. Click Save registration
   {"name":"Click Save registration","action":"click","locator":{"role":"button","name":"Save registration"},"contains":false}
18. Expect page-result = required fields
   {"name":"Expect page-result = required fields","action":"assertText","locator":{"testId":"page-result"},"value":"required fields","contains":true}
19. Backend independently rejects missing terms
   {"name":"Backend independently rejects missing terms","target":"api","kind":"api","method":"POST","path":"/api/forms","headers":{},"body":{"fullName":"Acceptance Tester","email":"acceptance@example.test","terms":false},"expect":{"status":422,"checks":[{"path":"body.error","contains":"accepted terms"}],"allowSoapFault":false},"capture":{}}
20. Check I accept the demo terms (required)
   {"name":"Check I accept the demo terms (required)","action":"check","locator":{"label":"I accept the demo terms (required)"},"contains":false}
21. Click Save registration
   {"name":"Click Save registration","action":"click","locator":{"role":"button","name":"Save registration"},"contains":false}
22. Expect page-result = Registration saved for Acceptance Tester
   {"name":"Expect page-result = Registration saved for Acceptance Tester","action":"assertText","locator":{"testId":"page-result"},"value":"Registration saved for Acceptance Tester","contains":false}
23. Submission produced a persisted form event
   {"name":"Submission produced a persisted form event","target":"api","kind":"api","method":"GET","path":"/api/state","headers":{},"expect":{"status":200,"checks":[{"path":"body.events.0.type","equals":"form"},{"path":"body.events.0.message","equals":"Form submitted: Acceptance Tester"}],"allowSoapFault":false},"capture":{}}

## LAB03 — Dates, multiple selection, keyboard slider and framework expose submitted values

Outcome: passed. Requirements: LAB03.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Forms
   {"name":"Navigate > Forms","action":"menu","contains":false,"menuPath":["Navigate","Forms"],"menuSource":"native"}
3. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
4. Open forms/input-lab
   {"name":"Open forms/input-lab","action":"click","locator":{"testId":"nav-forms-input-lab"},"contains":false}
5. Expect page-title = Input laboratory
   {"name":"Expect page-title = Input laboratory","action":"assertText","locator":{"testId":"page-title"},"value":"Input laboratory","contains":false}
6. Fill Quantity
   {"name":"Fill Quantity","action":"fill","locator":{"label":"Quantity"},"value":"9","contains":false}
7. Fill Start date
   {"name":"Fill Start date","action":"fill","locator":{"label":"Start date"},"value":"2026-11-15","contains":false}
8. Fill Start time
   {"name":"Fill Start time","action":"fill","locator":{"label":"Start time"},"value":"14:45","contains":false}
9. Fill Meeting date and time
   {"name":"Fill Meeting date and time","action":"fill","locator":{"label":"Meeting date and time"},"value":"2026-11-15T14:45","contains":false}
10. Fill Reporting month
   {"name":"Fill Reporting month","action":"fill","locator":{"label":"Reporting month"},"value":"2026-12","contains":false}
11. Fill Reporting week
   {"name":"Fill Reporting week","action":"fill","locator":{"label":"Reporting week"},"value":"2026-W47","contains":false}
12. Press Home in Confidence
   {"name":"Press Home in Confidence","action":"press","locator":{"label":"Confidence"},"value":"Home","contains":false}
13. Expect Confidence value
   {"name":"Expect Confidence value","action":"assertValue","locator":{"label":"Confidence"},"value":"0","contains":false}
14. Press End in Confidence
   {"name":"Press End in Confidence","action":"press","locator":{"label":"Confidence"},"value":"End","contains":false}
15. Expect Confidence value
   {"name":"Expect Confidence value","action":"assertValue","locator":{"label":"Confidence"},"value":"100","contains":false}
16. Select Skills (multiple selection) = Playwright
   {"name":"Select Skills (multiple selection) = Playwright","action":"select","locator":{"label":"Skills (multiple selection)"},"value":"Playwright","contains":false}
17. Press Shift+ArrowDown in Skills (multiple selection)
   {"name":"Press Shift+ArrowDown in Skills (multiple selection)","action":"press","locator":{"label":"Skills (multiple selection)"},"value":"Shift+ArrowDown","contains":false}
18. Expect 2 elements: select[name="skills"] option:checked
   {"name":"Expect 2 elements: select[name=\"skills\"] option:checked","action":"assertCount","locator":{"css":"select[name=\"skills\"] option:checked"},"value":2,"contains":false}
19. Fill Test framework
   {"name":"Fill Test framework","action":"fill","locator":{"label":"Test framework"},"value":"Infi","contains":false}
20. Choose observed framework
   {"name":"Choose observed framework","action":"click","locator":{"role":"option","name":"InfiAutomation"},"contains":false}
21. Expect Test framework value
   {"name":"Expect Test framework value","action":"assertValue","locator":{"label":"Test framework"},"value":"InfiAutomation","contains":false}
22. Click Read input values
   {"name":"Click Read input values","action":"click","locator":{"role":"button","name":"Read input values"},"contains":false}
23. Expect input-values = "quantity": "9"
   {"name":"Expect input-values = \"quantity\": \"9\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"quantity\": \"9\"","contains":true}
24. Expect input-values = "date": "2026-11-15"
   {"name":"Expect input-values = \"date\": \"2026-11-15\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"date\": \"2026-11-15\"","contains":true}
25. Expect input-values = "time": "14:45"
   {"name":"Expect input-values = \"time\": \"14:45\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"time\": \"14:45\"","contains":true}
26. Expect input-values = "datetime": "2026-11-15T14:45"
   {"name":"Expect input-values = \"datetime\": \"2026-11-15T14:45\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"datetime\": \"2026-11-15T14:45\"","contains":true}
27. Expect input-values = "month": "2026-12"
   {"name":"Expect input-values = \"month\": \"2026-12\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"month\": \"2026-12\"","contains":true}
28. Expect input-values = "week": "2026-W47"
   {"name":"Expect input-values = \"week\": \"2026-W47\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"week\": \"2026-W47\"","contains":true}
29. Expect input-values = "confidence": "100"
   {"name":"Expect input-values = \"confidence\": \"100\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"confidence\": \"100\"","contains":true}
30. Expect input-values = "Playwright"
   {"name":"Expect input-values = \"Playwright\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"Playwright\"","contains":true}
31. Expect input-values = "Electron"
   {"name":"Expect input-values = \"Electron\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"Electron\"","contains":true}
32. Expect input-values = "framework": "InfiAutomation"
   {"name":"Expect input-values = \"framework\": \"InfiAutomation\"","action":"assertText","locator":{"testId":"input-values"},"value":"\"framework\": \"InfiAutomation\"","contains":true}

## LAB04 — Project format, team boundaries, password length and confirmation are enforced

Outcome: passed. Requirements: LAB04.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Forms
   {"name":"Navigate > Forms","action":"menu","contains":false,"menuPath":["Navigate","Forms"],"menuSource":"native"}
3. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
4. Open forms/validation
   {"name":"Open forms/validation","action":"click","locator":{"testId":"nav-forms-validation"},"contains":false}
5. Expect page-title = Validation & editor
   {"name":"Expect page-title = Validation & editor","action":"assertText","locator":{"testId":"page-title"},"value":"Validation & editor","contains":false}
6. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
7. Expect page-result = Check project code
   {"name":"Expect page-result = Check project code","action":"assertText","locator":{"testId":"page-result"},"value":"Check project code","contains":true}
8. Fill Project code
   {"name":"Fill Project code","action":"fill","locator":{"label":"Project code"},"value":"abc-123","contains":false}
9. Fill Secure passphrase
   {"name":"Fill Secure passphrase","action":"fill","locator":{"label":"Secure passphrase"},"value":"12345678","contains":false}
10. Fill Confirm passphrase
   {"name":"Fill Confirm passphrase","action":"fill","locator":{"label":"Confirm passphrase"},"value":"12345678","contains":false}
11. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
12. Expect page-result = Check project code
   {"name":"Expect page-result = Check project code","action":"assertText","locator":{"testId":"page-result"},"value":"Check project code","contains":true}
13. Fill Project code
   {"name":"Fill Project code","action":"fill","locator":{"label":"Project code"},"value":"ABC-12","contains":false}
14. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
15. Expect page-result = Check project code
   {"name":"Expect page-result = Check project code","action":"assertText","locator":{"testId":"page-result"},"value":"Check project code","contains":true}
16. Fill Project code
   {"name":"Fill Project code","action":"fill","locator":{"label":"Project code"},"value":"ABC-123","contains":false}
17. Fill Team size
   {"name":"Fill Team size","action":"fill","locator":{"label":"Team size"},"value":"0","contains":false}
18. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
19. Expect page-result = Check project code
   {"name":"Expect page-result = Check project code","action":"assertText","locator":{"testId":"page-result"},"value":"Check project code","contains":true}
20. Fill Team size
   {"name":"Fill Team size","action":"fill","locator":{"label":"Team size"},"value":"21","contains":false}
21. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
22. Expect page-result = Check project code
   {"name":"Expect page-result = Check project code","action":"assertText","locator":{"testId":"page-result"},"value":"Check project code","contains":true}
23. Fill Team size
   {"name":"Fill Team size","action":"fill","locator":{"label":"Team size"},"value":"1","contains":false}
24. Fill Secure passphrase
   {"name":"Fill Secure passphrase","action":"fill","locator":{"label":"Secure passphrase"},"value":"1234567","contains":false}
25. Fill Confirm passphrase
   {"name":"Fill Confirm passphrase","action":"fill","locator":{"label":"Confirm passphrase"},"value":"1234567","contains":false}
26. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
27. Expect page-result = Check project code
   {"name":"Expect page-result = Check project code","action":"assertText","locator":{"testId":"page-result"},"value":"Check project code","contains":true}
28. Fill Secure passphrase
   {"name":"Fill Secure passphrase","action":"fill","locator":{"label":"Secure passphrase"},"value":"12345678","contains":false}
29. Fill Confirm passphrase
   {"name":"Fill Confirm passphrase","action":"fill","locator":{"label":"Confirm passphrase"},"value":"87654321","contains":false}
30. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
31. Expect page-result = Passphrases do not match.
   {"name":"Expect page-result = Passphrases do not match.","action":"assertText","locator":{"testId":"page-result"},"value":"Passphrases do not match.","contains":false}
32. Fill Confirm passphrase
   {"name":"Fill Confirm passphrase","action":"fill","locator":{"label":"Confirm passphrase"},"value":"12345678","contains":false}
33. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
34. Expect page-result = Project ABC-123 is valid.
   {"name":"Expect page-result = Project ABC-123 is valid.","action":"assertText","locator":{"testId":"page-result"},"value":"Project ABC-123 is valid.","contains":true}
35. Fill Team size
   {"name":"Fill Team size","action":"fill","locator":{"label":"Team size"},"value":"20","contains":false}
36. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
37. Expect page-result = Project ABC-123 is valid.
   {"name":"Expect page-result = Project ABC-123 is valid.","action":"assertText","locator":{"testId":"page-result"},"value":"Project ABC-123 is valid.","contains":true}

## LAB05 — Customers create, edit, search, persist and delete across UI and REST

Outcome: passed. Requirements: LAB05.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
3. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
4. Open records/customers
   {"name":"Open records/customers","action":"click","locator":{"testId":"nav-records-customers"},"contains":false}
5. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
6. Click + Add customer
   {"name":"Click + Add customer","action":"click","locator":{"role":"button","name":"+ Add customer"},"contains":false}
7. Fill Customer name
   {"name":"Fill Customer name","action":"fill","locator":{"label":"Customer name"},"value":"Acceptance Customer","contains":false}
8. Fill Email address
   {"name":"Fill Email address","action":"fill","locator":{"label":"Email address"},"value":"customer@example.test","contains":false}
9. Click Create customer
   {"name":"Click Create customer","action":"click","locator":{"role":"button","name":"Create customer"},"contains":false}
10. Fill Search customers
   {"name":"Fill Search customers","action":"fill","locator":{"label":"Search customers"},"value":"Acceptance Customer","contains":false}
11. Expect 1 elements: [data-testid="customer-row"]
   {"name":"Expect 1 elements: [data-testid=\"customer-row\"]","action":"assertCount","locator":{"css":"[data-testid=\"customer-row\"]"},"value":1,"contains":false}
12. Created customer exists in REST
   {"name":"Created customer exists in REST","target":"api","kind":"api","method":"GET","path":"/api/customers?q=Acceptance%20Customer","headers":{},"expect":{"status":200,"checks":[{"path":"body.total","equals":1},{"path":"body.items.0.email","equals":"customer@example.test"}],"allowSoapFault":false},"capture":{"customerId":"body.items.0.id"}}
13. Navigate > Workspace
   {"name":"Navigate > Workspace","action":"menu","contains":false,"menuPath":["Navigate","Workspace"],"menuSource":"native"}
14. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
15. Open workspace/overview
   {"name":"Open workspace/overview","action":"click","locator":{"testId":"nav-workspace-overview"},"contains":false}
16. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
17. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
18. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
19. Open records/customers
   {"name":"Open records/customers","action":"click","locator":{"testId":"nav-records-customers"},"contains":false}
20. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
21. Fill Search customers
   {"name":"Fill Search customers","action":"fill","locator":{"label":"Search customers"},"value":"Acceptance Customer","contains":false}
22. Expect 1 elements: [data-testid="customer-row"]
   {"name":"Expect 1 elements: [data-testid=\"customer-row\"]","action":"assertCount","locator":{"css":"[data-testid=\"customer-row\"]"},"value":1,"contains":false}
23. Click Edit Acceptance Customer
   {"name":"Click Edit Acceptance Customer","action":"click","locator":{"role":"button","name":"Edit Acceptance Customer"},"contains":false}
24. Fill Customer name
   {"name":"Fill Customer name","action":"fill","locator":{"label":"Customer name"},"value":"Acceptance Updated","contains":false}
25. Click Save changes
   {"name":"Click Save changes","action":"click","locator":{"role":"button","name":"Save changes"},"contains":false}
26. Edited customer persisted
   {"name":"Edited customer persisted","target":"api","kind":"api","method":"GET","path":"/api/customers/${vars.customerId}","headers":{},"expect":{"status":200,"checks":[{"path":"body.name","equals":"Acceptance Updated"}],"allowSoapFault":false},"capture":{}}
27. Fill Search customers
   {"name":"Fill Search customers","action":"fill","locator":{"label":"Search customers"},"value":"Acceptance Updated","contains":false}
28. Expect 1 elements: [data-testid="customer-row"]
   {"name":"Expect 1 elements: [data-testid=\"customer-row\"]","action":"assertCount","locator":{"css":"[data-testid=\"customer-row\"]"},"value":1,"contains":false}
29. Click Delete Acceptance Updated
   {"name":"Click Delete Acceptance Updated","action":"click","locator":{"role":"button","name":"Delete Acceptance Updated"},"contains":false}
30. Click Delete customer
   {"name":"Click Delete customer","action":"click","locator":{"role":"button","name":"Delete customer"},"contains":false}
31. Fill Search customers
   {"name":"Fill Search customers","action":"fill","locator":{"label":"Search customers"},"value":"Acceptance Updated","contains":false}
32. Expect empty-customers = No customers match your filters.
   {"name":"Expect empty-customers = No customers match your filters.","action":"assertText","locator":{"testId":"empty-customers"},"value":"No customers match your filters.","contains":false}
33. Deleted customer is absent
   {"name":"Deleted customer is absent","target":"api","kind":"api","method":"GET","path":"/api/customers/${vars.customerId}","headers":{},"expect":{"status":404,"checks":[{"path":"body.error","equals":"Customer not found"}],"allowSoapFault":false},"capture":{}}

## LAB06 — Grid selects five of eighteen records and paginates to the final three

Outcome: passed. Requirements: LAB06.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
3. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
4. Open records/grid
   {"name":"Open records/grid","action":"click","locator":{"testId":"nav-records-grid"},"contains":false}
5. Expect page-title = Advanced data grid
   {"name":"Expect page-title = Advanced data grid","action":"assertText","locator":{"testId":"page-title"},"value":"Advanced data grid","contains":false}
6. Expect .pagination text
   {"name":"Expect .pagination text","action":"assertText","locator":{"css":".pagination"},"value":"18 records","contains":true}
7. Expect 5 elements: #grid-table tbody tr
   {"name":"Expect 5 elements: #grid-table tbody tr","action":"assertCount","locator":{"css":"#grid-table tbody tr"},"value":5,"contains":false}
8. Check Select current page
   {"name":"Check Select current page","action":"check","locator":{"label":"Select current page"},"contains":false}
9. Expect #selection-count text
   {"name":"Expect #selection-count text","action":"assertText","locator":{"css":"#selection-count"},"value":"5 rows selected","contains":false}
10. Click Next page
   {"name":"Click Next page","action":"click","locator":{"role":"button","name":"Next page"},"contains":false}
11. Expect .pagination text
   {"name":"Expect .pagination text","action":"assertText","locator":{"css":".pagination"},"value":"Page 2 of 4","contains":true}
12. Expect #selection-count text
   {"name":"Expect #selection-count text","action":"assertText","locator":{"css":"#selection-count"},"value":"5 rows selected","contains":false}
13. Click Next page
   {"name":"Click Next page","action":"click","locator":{"role":"button","name":"Next page"},"contains":false}
14. Click Next page
   {"name":"Click Next page","action":"click","locator":{"role":"button","name":"Next page"},"contains":false}
15. Expect .pagination text
   {"name":"Expect .pagination text","action":"assertText","locator":{"css":".pagination"},"value":"Page 4 of 4","contains":true}
16. Expect 3 elements: #grid-table tbody tr
   {"name":"Expect 3 elements: #grid-table tbody tr","action":"assertCount","locator":{"css":"#grid-table tbody tr"},"value":3,"contains":false}
17. Expected enabled=false: Next page
   {"name":"Expected enabled=false: Next page","action":"assertEnabled","locator":{"role":"button","name":"Next page"},"value":false,"contains":false}
18. Click Previous page
   {"name":"Click Previous page","action":"click","locator":{"role":"button","name":"Previous page"},"contains":false}
19. Expect .pagination text
   {"name":"Expect .pagination text","action":"assertText","locator":{"css":".pagination"},"value":"Page 3 of 4","contains":true}

## LAB07 — Native JSON export reports a real path and Compact changes renderer state

Outcome: passed. Requirements: LAB07.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. File > Export > Export JSON
   {"name":"File > Export > Export JSON","action":"menu","contains":false,"menuPath":["File","Export","Export JSON"],"menuSource":"native"}
3. Expect command-status = C:/InfiComponentLab\.runtime\acceptance-execution-20261104-acceptance-rerun-1793786183771\lab-data\infi-lab-export.json
   {"name":"Expect command-status = C:/InfiComponentLab\\.runtime\\acceptance-execution-20261104-acceptance-rerun-1793786183771\\lab-data\\infi-lab-export.json","action":"assertText","locator":{"testId":"command-status"},"value":"C:/InfiComponentLab\\.runtime\\acceptance-execution-20261104-acceptance-rerun-1793786183771\\lab-data\\infi-lab-export.json","contains":true}
4. View > Compact mode
   {"name":"View > Compact mode","action":"menu","contains":false,"menuPath":["View","Compact mode"],"menuSource":"native"}
5. Expect command-status = Compact mode on
   {"name":"Expect command-status = Compact mode on","action":"assertText","locator":{"testId":"command-status"},"value":"Compact mode on","contains":false}
6. Expect 1 elements: body.compact
   {"name":"Expect 1 elements: body.compact","action":"assertCount","locator":{"css":"body.compact"},"value":1,"contains":false}
7. View > Compact mode
   {"name":"View > Compact mode","action":"menu","contains":false,"menuPath":["View","Compact mode"],"menuSource":"native"}
8. Expect command-status = Compact mode off
   {"name":"Expect command-status = Compact mode off","action":"assertText","locator":{"testId":"command-status"},"value":"Compact mode off","contains":false}
9. Expect 0 elements: body.compact
   {"name":"Expect 0 elements: body.compact","action":"assertCount","locator":{"css":"body.compact"},"value":0,"contains":false}

## LAB08 — DOM File action, double click and disabled button preserve explicit behavior

Outcome: passed. Requirements: LAB08.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
3. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
4. Open components/actions
   {"name":"Open components/actions","action":"click","locator":{"testId":"nav-components-actions"},"contains":false}
5. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
6. Explicit DOM File > Save note
   {"name":"Explicit DOM File > Save note","action":"menu","contains":false,"menuPath":["File","Save note"],"menuSource":"dom"}
7. Expect page-result = DOM note saved
   {"name":"Expect page-result = DOM note saved","action":"assertText","locator":{"testId":"page-result"},"value":"DOM note saved","contains":false}
8. Double click
   {"name":"Double click","action":"doubleClick","locator":{"role":"button","name":"Double-click me"},"contains":false}
9. Expect page-result = Double-click detected
   {"name":"Expect page-result = Double-click detected","action":"assertText","locator":{"testId":"page-result"},"value":"Double-click detected","contains":false}
10. Disabled remains disabled
   {"name":"Disabled remains disabled","action":"assertEnabled","locator":{"testId":"disabled-button"},"value":false,"contains":false}

## LAB09 — Note dialog cancels without saving and saves only the submitted note

Outcome: passed. Requirements: LAB09.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
3. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
4. Open components/overlays
   {"name":"Open components/overlays","action":"click","locator":{"testId":"nav-components-overlays"},"contains":false}
5. Expect page-title = Dialogs & overlays
   {"name":"Expect page-title = Dialogs & overlays","action":"assertText","locator":{"testId":"page-title"},"value":"Dialogs & overlays","contains":false}
6. Click Open modal
   {"name":"Click Open modal","action":"click","locator":{"role":"button","name":"Open modal"},"contains":false}
7. Fill Workspace note
   {"name":"Fill Workspace note","action":"fill","locator":{"label":"Workspace note"},"value":"Discard first note","contains":false}
8. Click Cancel
   {"name":"Click Cancel","action":"click","locator":{"role":"button","name":"Cancel"},"contains":false}
9. Expect 0 elements: #app-dialog[open]
   {"name":"Expect 0 elements: #app-dialog[open]","action":"assertCount","locator":{"css":"#app-dialog[open]"},"value":0,"contains":false}
10. Expect 0 elements: [data-testid="page-result"]:not([hidden])
   {"name":"Expect 0 elements: [data-testid=\"page-result\"]:not([hidden])","action":"assertCount","locator":{"css":"[data-testid=\"page-result\"]:not([hidden])"},"value":0,"contains":false}
11. Click Open modal
   {"name":"Click Open modal","action":"click","locator":{"role":"button","name":"Open modal"},"contains":false}
12. Fill Workspace note
   {"name":"Fill Workspace note","action":"fill","locator":{"label":"Workspace note"},"value":"Acceptance saved note","contains":false}
13. Click Save note
   {"name":"Click Save note","action":"click","locator":{"role":"button","name":"Save note"},"contains":false}
14. Expect 0 elements: #app-dialog[open]
   {"name":"Expect 0 elements: #app-dialog[open]","action":"assertCount","locator":{"css":"#app-dialog[open]"},"value":0,"contains":false}
15. Expect page-result = Note saved: Acceptance saved note
   {"name":"Expect page-result = Note saved: Acceptance saved note","action":"assertText","locator":{"testId":"page-result"},"value":"Note saved: Acceptance saved note","contains":false}
16. Click Open modal
   {"name":"Click Open modal","action":"click","locator":{"role":"button","name":"Open modal"},"contains":false}
17. Fill Workspace note
   {"name":"Fill Workspace note","action":"fill","locator":{"label":"Workspace note"},"value":"Discard second note","contains":false}
18. Click Cancel
   {"name":"Click Cancel","action":"click","locator":{"role":"button","name":"Cancel"},"contains":false}
19. Expect 0 elements: #app-dialog[open]
   {"name":"Expect 0 elements: #app-dialog[open]","action":"assertCount","locator":{"css":"#app-dialog[open]"},"value":0,"contains":false}
20. Expect page-result = Note saved: Acceptance saved note
   {"name":"Expect page-result = Note saved: Acceptance saved note","action":"assertText","locator":{"testId":"page-result"},"value":"Note saved: Acceptance saved note","contains":false}

## LAB10 — Tabs change visible panels and expanded tree selects Reports

Outcome: passed. Requirements: LAB10.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
3. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
4. Open components/structure
   {"name":"Open components/structure","action":"click","locator":{"testId":"nav-components-structure"},"contains":false}
5. Expect page-title = Tabs, tree & accordion
   {"name":"Expect page-title = Tabs, tree & accordion","action":"assertText","locator":{"testId":"page-title"},"value":"Tabs, tree & accordion","contains":false}
6. Open Details
   {"name":"Open Details","action":"click","locator":{"role":"tab","name":"Details"},"contains":false}
7. Expect 1 elements: #tab-panel-1:not([hidden])
   {"name":"Expect 1 elements: #tab-panel-1:not([hidden])","action":"assertCount","locator":{"css":"#tab-panel-1:not([hidden])"},"value":1,"contains":false}
8. Expect 1 elements: #tab-panel-0[hidden]
   {"name":"Expect 1 elements: #tab-panel-0[hidden]","action":"assertCount","locator":{"css":"#tab-panel-0[hidden]"},"value":1,"contains":false}
9. Open History
   {"name":"Open History","action":"click","locator":{"role":"tab","name":"History"},"contains":false}
10. Expect 1 elements: #tab-panel-2:not([hidden])
   {"name":"Expect 1 elements: #tab-panel-2:not([hidden])","action":"assertCount","locator":{"css":"#tab-panel-2:not([hidden])"},"value":1,"contains":false}
11. Expand project
   {"name":"Expand project","action":"click","locator":{"css":"#tree-root"},"contains":false}
12. Select Reports
   {"name":"Select Reports","action":"click","locator":{"role":"treeitem","name":"Reports"},"contains":false}
13. Expect page-result = Tree selected: Reports
   {"name":"Expect page-result = Tree selected: Reports","action":"assertText","locator":{"testId":"page-result"},"value":"Tree selected: Reports","contains":false}
14. Expect 1 elements: [role="treeitem"][aria-selected="true"][data-tree-leaf="Reports"]
   {"name":"Expect 1 elements: [role=\"treeitem\"][aria-selected=\"true\"][data-tree-leaf=\"Reports\"]","action":"assertCount","locator":{"css":"[role=\"treeitem\"][aria-selected=\"true\"][data-tree-leaf=\"Reports\"]"},"value":1,"contains":false}

## LAB11 — Same-origin iframe and open shadow forms retain independent feedback

Outcome: passed. Requirements: LAB11.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Files & Media
   {"name":"Navigate > Files & Media","action":"menu","contains":false,"menuPath":["Navigate","Files & Media"],"menuSource":"native"}
3. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
4. Open files/preview
   {"name":"Open files/preview","action":"click","locator":{"testId":"nav-files-preview"},"contains":false}
5. Expect page-title = Frames & media
   {"name":"Expect page-title = Frames & media","action":"assertText","locator":{"testId":"page-title"},"value":"Frames & media","contains":false}
6. Frame feedback
   {"name":"Frame feedback","action":"fill","locator":{"label":"Frame feedback","frame":"#lab-frame"},"value":"Acceptance frame","contains":false}
7. Save frame
   {"name":"Save frame","action":"click","locator":{"role":"button","name":"Save frame feedback","frame":"#lab-frame"},"contains":false}
8. Frame saved
   {"name":"Frame saved","action":"assertText","locator":{"testId":"frame-result","frame":"#lab-frame"},"value":"Frame saved: Acceptance frame","contains":false}
9. Shadow feedback
   {"name":"Shadow feedback","action":"fill","locator":{"testId":"shadow-input"},"value":"Acceptance shadow","contains":false}
10. Click Save shadow feedback
   {"name":"Click Save shadow feedback","action":"click","locator":{"role":"button","name":"Save shadow feedback"},"contains":false}
11. Expect shadow-output = Shadow saved: Acceptance shadow
   {"name":"Expect shadow-output = Shadow saved: Acceptance shadow","action":"assertText","locator":{"testId":"shadow-output"},"value":"Shadow saved: Acceptance shadow","contains":false}
12. Frame remains independent
   {"name":"Frame remains independent","action":"assertText","locator":{"testId":"frame-result","frame":"#lab-frame"},"value":"Frame saved: Acceptance frame","contains":false}

## LAB12 — Invalid credentials reject; login, session read, logout and post-logout denial work

Outcome: passed. Requirements: LAB12.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Workspace
   {"name":"Navigate > Workspace","action":"menu","contains":false,"menuPath":["Navigate","Workspace"],"menuSource":"native"}
3. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
4. Open workspace/session
   {"name":"Open workspace/session","action":"click","locator":{"testId":"nav-workspace-session"},"contains":false}
5. Expect page-title = Sign-in sandbox
   {"name":"Expect page-title = Sign-in sandbox","action":"assertText","locator":{"testId":"page-title"},"value":"Sign-in sandbox","contains":false}
6. Fill Account email
   {"name":"Fill Account email","action":"fill","locator":{"label":"Account email"},"value":"tester@example.test","contains":false}
7. Fill Account password
   {"name":"Fill Account password","action":"fill","locator":{"label":"Account password"},"value":"wrong","contains":false}
8. Click Sign in
   {"name":"Click Sign in","action":"click","locator":{"role":"button","name":"Sign in"},"contains":false}
9. Expect page-result = incorrect
   {"name":"Expect page-result = incorrect","action":"assertText","locator":{"testId":"page-result"},"value":"incorrect","contains":true}
10. Fill Account password
   {"name":"Fill Account password","action":"fill","locator":{"label":"Account password"},"value":"LabPass!2026","contains":false}
11. Click Sign in
   {"name":"Click Sign in","action":"click","locator":{"role":"button","name":"Sign in"},"contains":false}
12. Expect session-user = Signed in as Alex Morgan
   {"name":"Expect session-user = Signed in as Alex Morgan","action":"assertText","locator":{"testId":"session-user"},"value":"Signed in as Alex Morgan","contains":false}
13. Click Check session
   {"name":"Click Check session","action":"click","locator":{"role":"button","name":"Check session"},"contains":false}
14. Expect page-result = Session is active
   {"name":"Expect page-result = Session is active","action":"assertText","locator":{"testId":"page-result"},"value":"Session is active","contains":false}
15. Click Sign out
   {"name":"Click Sign out","action":"click","locator":{"role":"button","name":"Sign out"},"contains":false}
16. Expect session-user = Signed out
   {"name":"Expect session-user = Signed out","action":"assertText","locator":{"testId":"session-user"},"value":"Signed out","contains":false}
17. Click Check session
   {"name":"Click Check session","action":"click","locator":{"role":"button","name":"Check session"},"contains":false}
18. Expect page-result = Sign in to continue
   {"name":"Expect page-result = Sign in to continue","action":"assertText","locator":{"testId":"page-result"},"value":"Sign in to continue","contains":false}

## LAB13 — Wizard validates all three stages and persists the resulting order

Outcome: passed. Requirements: LAB13.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Workflows
   {"name":"Navigate > Workflows","action":"menu","contains":false,"menuPath":["Navigate","Workflows"],"menuSource":"native"}
3. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
4. Open workflows/wizard
   {"name":"Open workflows/wizard","action":"click","locator":{"testId":"nav-workflows-wizard"},"contains":false}
5. Expect page-title = Order wizard
   {"name":"Expect page-title = Order wizard","action":"assertText","locator":{"testId":"page-title"},"value":"Order wizard","contains":false}
6. Click Continue
   {"name":"Click Continue","action":"click","locator":{"role":"button","name":"Continue"},"contains":false}
7. Expect 1 elements: #wizard-form select[name="customer"]
   {"name":"Expect 1 elements: #wizard-form select[name=\"customer\"]","action":"assertCount","locator":{"css":"#wizard-form select[name=\"customer\"]"},"value":1,"contains":false}
8. Select Order customer = Aarav Shah
   {"name":"Select Order customer = Aarav Shah","action":"select","locator":{"label":"Order customer"},"value":"Aarav Shah","contains":false}
9. Click Continue
   {"name":"Click Continue","action":"click","locator":{"role":"button","name":"Continue"},"contains":false}
10. Fill Order amount
   {"name":"Fill Order amount","action":"fill","locator":{"label":"Order amount"},"value":"0","contains":false}
11. Click Continue
   {"name":"Click Continue","action":"click","locator":{"role":"button","name":"Continue"},"contains":false}
12. Expect 1 elements: #wizard-form input[name="amount"]
   {"name":"Expect 1 elements: #wizard-form input[name=\"amount\"]","action":"assertCount","locator":{"css":"#wizard-form input[name=\"amount\"]"},"value":1,"contains":false}
13. Fill Order amount
   {"name":"Fill Order amount","action":"fill","locator":{"label":"Order amount"},"value":"640","contains":false}
14. Click Continue
   {"name":"Click Continue","action":"click","locator":{"role":"button","name":"Continue"},"contains":false}
15. Expect order-review = Customer: Aarav Shah
   {"name":"Expect order-review = Customer: Aarav Shah","action":"assertText","locator":{"testId":"order-review"},"value":"Customer: Aarav Shah","contains":true}
16. Click Place order
   {"name":"Click Place order","action":"click","locator":{"role":"button","name":"Place order"},"contains":false}
17. Expect 1 elements: #wizard-form input[name="confirmed"]:not(:checked)
   {"name":"Expect 1 elements: #wizard-form input[name=\"confirmed\"]:not(:checked)","action":"assertCount","locator":{"css":"#wizard-form input[name=\"confirmed\"]:not(:checked)"},"value":1,"contains":false}
18. No order without confirmation
   {"name":"No order without confirmation","target":"api","kind":"api","method":"GET","path":"/api/state","headers":{},"expect":{"status":200,"checks":[{"path":"body.orders.length","equals":8}],"allowSoapFault":false},"capture":{}}
19. Check I confirm this demo order
   {"name":"Check I confirm this demo order","action":"check","locator":{"label":"I confirm this demo order"},"contains":false}
20. Click Place order
   {"name":"Click Place order","action":"click","locator":{"role":"button","name":"Place order"},"contains":false}
21. Expect order-success = created for Aarav Shah
   {"name":"Expect order-success = created for Aarav Shah","action":"assertText","locator":{"testId":"order-success"},"value":"created for Aarav Shah","contains":true}
22. Order exists in persisted backend
   {"name":"Order exists in persisted backend","target":"api","kind":"api","method":"GET","path":"/api/state","headers":{},"expect":{"status":200,"checks":[{"path":"body.orders.length","equals":9},{"path":"body.orders.0.customer","equals":"Aarav Shah"},{"path":"body.orders.0.amount","equals":640}],"allowSoapFault":false},"capture":{}}
23. Click View orders
   {"name":"Click View orders","action":"click","locator":{"role":"button","name":"View orders"},"contains":false}
24. Expect page-title = Orders
   {"name":"Expect page-title = Orders","action":"assertText","locator":{"testId":"page-title"},"value":"Orders","contains":false}
25. Expect #order-table tbody tr:first-child text
   {"name":"Expect #order-table tbody tr:first-child text","action":"assertText","locator":{"css":"#order-table tbody tr:first-child"},"value":"Aarav Shah","contains":true}
26. Expect #order-table tbody tr:first-child text
   {"name":"Expect #order-table tbody tr:first-child text","action":"assertText","locator":{"css":"#order-table tbody tr:first-child"},"value":"640","contains":true}

## LAB14 — HTTP 503 error is reported, Success recovers and delayed content becomes ready

Outcome: passed. Requirements: LAB14.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Workflows
   {"name":"Navigate > Workflows","action":"menu","contains":false,"menuPath":["Navigate","Workflows"],"menuSource":"native"}
3. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
4. Open workflows/requests
   {"name":"Open workflows/requests","action":"click","locator":{"testId":"nav-workflows-requests"},"contains":false}
5. Expect page-title = Async & recovery
   {"name":"Expect page-title = Async & recovery","action":"assertText","locator":{"testId":"page-title"},"value":"Async & recovery","contains":false}
6. Intentional error is actual HTTP 503
   {"name":"Intentional error is actual HTTP 503","target":"api","kind":"api","method":"GET","path":"/api/lab?mode=error","headers":{},"expect":{"status":503,"checks":[{"path":"body.error","contains":"Intentional lab error"}],"allowSoapFault":false},"capture":{}}
7. Select Response scenario = Server error
   {"name":"Select Response scenario = Server error","action":"select","locator":{"label":"Response scenario"},"value":"Server error","contains":false}
8. Click Send request
   {"name":"Click Send request","action":"click","locator":{"role":"button","name":"Send request"},"contains":false}
9. Expect request-response = Intentional lab error
   {"name":"Expect request-response = Intentional lab error","action":"assertText","locator":{"testId":"request-response"},"value":"Intentional lab error","contains":true}
10. Select Response scenario = Success
   {"name":"Select Response scenario = Success","action":"select","locator":{"label":"Response scenario"},"value":"Success","contains":false}
11. Click Send request
   {"name":"Click Send request","action":"click","locator":{"role":"button","name":"Send request"},"contains":false}
12. Expect request-response = Request completed successfully
   {"name":"Expect request-response = Request completed successfully","action":"assertText","locator":{"testId":"request-response"},"value":"Request completed successfully","contains":true}
13. Click Load delayed content
   {"name":"Click Load delayed content","action":"click","locator":{"role":"button","name":"Load delayed content"},"contains":false}
14. Expect delayed-result = Delayed content is ready
   {"name":"Expect delayed-result = Delayed content is ready","action":"assertText","locator":{"testId":"delayed-result"},"value":"Delayed content is ready","contains":false}

## LAB15 — Uniquely titled Inspector stores its own note and returns to Workspace

Outcome: passed. Requirements: LAB15.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Tools > Open Inspector
   {"name":"Tools > Open Inspector","action":"menu","contains":false,"menuPath":["Tools","Open Inspector"],"menuSource":"native"}
3. Select Inspector
   {"name":"Select Inspector","action":"selectWindow","value":"InfiComponent Lab - Inspector","contains":false}
4. Inspector unique title
   {"name":"Inspector unique title","action":"assertTitle","value":"InfiComponent Lab - Inspector","contains":false}
5. Fill Inspector note
   {"name":"Fill Inspector note","action":"fill","locator":{"label":"Inspector note"},"value":"Acceptance independent note","contains":false}
6. Click Save inspector note
   {"name":"Click Save inspector note","action":"click","locator":{"role":"button","name":"Save inspector note"},"contains":false}
7. Expect inspector-result = Inspector saved: Acceptance independent note
   {"name":"Expect inspector-result = Inspector saved: Acceptance independent note","action":"assertText","locator":{"testId":"inspector-result"},"value":"Inspector saved: Acceptance independent note","contains":false}
8. Select Workspace
   {"name":"Select Workspace","action":"selectWindow","value":"InfiComponent Lab - Workspace","contains":false}
9. Workspace title
   {"name":"Workspace title","action":"assertTitle","value":"InfiComponent Lab - Workspace","contains":false}
10. Expect 0 elements: [data-testid="inspector-result"]
   {"name":"Expect 0 elements: [data-testid=\"inspector-result\"]","action":"assertCount","locator":{"css":"[data-testid=\"inspector-result\"]"},"value":0,"contains":false}
11. Return Inspector retains note
   {"name":"Return Inspector retains note","action":"selectWindow","value":"InfiComponent Lab - Inspector","contains":false}
12. Expect inspector-result = Inspector saved: Acceptance independent note
   {"name":"Expect inspector-result = Inspector saved: Acceptance independent note","action":"assertText","locator":{"testId":"inspector-result"},"value":"Inspector saved: Acceptance independent note","contains":false}
13. Return Workspace
   {"name":"Return Workspace","action":"selectWindow","value":"InfiComponent Lab - Workspace","contains":false}

## LAB16 — API-created synthetic customer is exactly one matching renderer row

Outcome: passed. Requirements: LAB16.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Start owned app before REST
   {"name":"Start owned app before REST","action":"assertTitle","value":"InfiComponent Lab - Workspace","contains":false}
3. Create REST customer
   {"name":"Create REST customer","target":"api","kind":"api","method":"POST","path":"/api/customers","headers":{},"body":{"name":"API Acceptance Customer","email":"crosslayer@example.test","department":"Quality"},"expect":{"status":201,"checks":[{"path":"body.name","equals":"API Acceptance Customer"}],"allowSoapFault":false},"capture":{}}
4. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
5. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
6. Open records/customers
   {"name":"Open records/customers","action":"click","locator":{"testId":"nav-records-customers"},"contains":false}
7. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
8. Fill Search customers
   {"name":"Fill Search customers","action":"fill","locator":{"label":"Search customers"},"value":"API Acceptance Customer","contains":false}
9. Expect 1 elements: [data-testid="customer-row"]
   {"name":"Expect 1 elements: [data-testid=\"customer-row\"]","action":"assertCount","locator":{"css":"[data-testid=\"customer-row\"]"},"value":1,"contains":false}
10. Expect [data-testid="customer-row"] text
   {"name":"Expect [data-testid=\"customer-row\"] text","action":"assertText","locator":{"css":"[data-testid=\"customer-row\"]"},"value":"API Acceptance Customer","contains":true}
11. Expect [data-testid="customer-row"] text
   {"name":"Expect [data-testid=\"customer-row\"] text","action":"assertText","locator":{"css":"[data-testid=\"customer-row\"]"},"value":"crosslayer@example.test","contains":true}

## SUP01 — Upload/download API returns identical bytes and renderer lists the real file

Outcome: passed. Requirements: SUP01.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Start app
   {"name":"Start app","action":"assertTitle","value":"InfiComponent Lab - Workspace","contains":false}
3. Upload synthetic bytes
   {"name":"Upload synthetic bytes","target":"api","kind":"api","method":"POST","path":"/api/upload","headers":{},"body":{"name":"acceptance.txt","type":"text/plain","data":"U3ludGhldGljIE1DUCByb3VuZHRyaXAK"},"expect":{"status":201,"checks":[{"path":"body.name","equals":"acceptance.txt"},{"path":"body.size","equals":24}],"allowSoapFault":false},"capture":{"uploadId":"body.id"}}
4. Download identical bytes
   {"name":"Download identical bytes","target":"api","kind":"api","method":"GET","path":"/api/download/${vars.uploadId}","headers":{},"expect":{"status":200,"checks":[{"path":"body","equals":"Synthetic MCP roundtrip\n"}],"allowSoapFault":false},"capture":{}}
5. Navigate > Files & Media
   {"name":"Navigate > Files & Media","action":"menu","contains":false,"menuPath":["Navigate","Files & Media"],"menuSource":"native"}
6. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
7. Open files/uploads
   {"name":"Open files/uploads","action":"click","locator":{"testId":"nav-files-uploads"},"contains":false}
8. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
9. Expect #uploaded-files text
   {"name":"Expect #uploaded-files text","action":"assertText","locator":{"css":"#uploaded-files"},"value":"acceptance.txt","contains":true}
10. Expect 1 elements: #uploaded-files a[download="acceptance.txt"]
   {"name":"Expect 1 elements: #uploaded-files a[download=\"acceptance.txt\"]","action":"assertCount","locator":{"css":"#uploaded-files a[download=\"acceptance.txt\"]"},"value":1,"contains":false}

## SUP02 — Task keyboard alternative creates and moves a persistent task

Outcome: passed. Requirements: SUP02.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Workflows
   {"name":"Navigate > Workflows","action":"menu","contains":false,"menuPath":["Navigate","Workflows"],"menuSource":"native"}
3. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
4. Open workflows/board
   {"name":"Open workflows/board","action":"click","locator":{"testId":"nav-workflows-board"},"contains":false}
5. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
6. Fill New task title
   {"name":"Fill New task title","action":"fill","locator":{"label":"New task title"},"value":"Acceptance keyboard task","contains":false}
7. Click + Add task
   {"name":"Click + Add task","action":"click","locator":{"role":"button","name":"+ Add task"},"contains":false}
8. Select Move Acceptance keyboard task = Done
   {"name":"Select Move Acceptance keyboard task = Done","action":"select","locator":{"label":"Move Acceptance keyboard task"},"value":"Done","contains":false}
9. Expect page-result = Task moved to Done
   {"name":"Expect page-result = Task moved to Done","action":"assertText","locator":{"testId":"page-result"},"value":"Task moved to Done","contains":false}
10. Expect Move Acceptance keyboard task value
   {"name":"Expect Move Acceptance keyboard task value","action":"assertValue","locator":{"label":"Move Acceptance keyboard task"},"value":"Done","contains":false}
11. Task move persisted
   {"name":"Task move persisted","target":"api","kind":"api","method":"GET","path":"/api/state","headers":{},"expect":{"status":200,"checks":[{"path":"body.tasks.3.title","equals":"Acceptance keyboard task"},{"path":"body.tasks.3.lane","equals":"Done"}],"allowSoapFault":false},"capture":{}}

## SUP03 — Tooltip, popover, progress, meter and accessible canvas have observable results

Outcome: passed. Requirements: SUP03.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
3. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
4. Open components/actions
   {"name":"Open components/actions","action":"click","locator":{"testId":"nav-components-actions"},"contains":false}
5. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
6. Hover observed tooltip trigger
   {"name":"Hover observed tooltip trigger","action":"hover","locator":{"role":"button","name":"Hover or focus me"},"contains":false}
7. Tooltip visible
   {"name":"Tooltip visible","action":"assertVisible","locator":{"role":"tooltip"},"contains":false}
8. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
9. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
10. Open components/overlays
   {"name":"Open components/overlays","action":"click","locator":{"testId":"nav-components-overlays"},"contains":false}
11. Expect page-title = Dialogs & overlays
   {"name":"Expect page-title = Dialogs & overlays","action":"assertText","locator":{"testId":"page-title"},"value":"Dialogs & overlays","contains":false}
12. Click Open popover
   {"name":"Click Open popover","action":"click","locator":{"role":"button","name":"Open popover"},"contains":false}
13. Expect 1 elements: #details-popover:popover-open
   {"name":"Expect 1 elements: #details-popover:popover-open","action":"assertCount","locator":{"css":"#details-popover:popover-open"},"value":1,"contains":false}
14. Click Close popover
   {"name":"Click Close popover","action":"click","locator":{"role":"button","name":"Close popover"},"contains":false}
15. Expect 0 elements: #details-popover:popover-open
   {"name":"Expect 0 elements: #details-popover:popover-open","action":"assertCount","locator":{"css":"#details-popover:popover-open"},"value":0,"contains":false}
16. Navigate > Components
   {"name":"Navigate > Components","action":"menu","contains":false,"menuPath":["Navigate","Components"],"menuSource":"native"}
17. Expect page-title = Buttons & menus
   {"name":"Expect page-title = Buttons & menus","action":"assertText","locator":{"testId":"page-title"},"value":"Buttons & menus","contains":false}
18. Open components/structure
   {"name":"Open components/structure","action":"click","locator":{"testId":"nav-components-structure"},"contains":false}
19. Expect page-title = Tabs, tree & accordion
   {"name":"Expect page-title = Tabs, tree & accordion","action":"assertText","locator":{"testId":"page-title"},"value":"Tabs, tree & accordion","contains":false}
20. Click Advance progress
   {"name":"Click Advance progress","action":"click","locator":{"role":"button","name":"Advance progress"},"contains":false}
21. Expect 1 elements: #demo-progress[value="50"]
   {"name":"Expect 1 elements: #demo-progress[value=\"50\"]","action":"assertCount","locator":{"css":"#demo-progress[value=\"50\"]"},"value":1,"contains":false}
22. Expect 1 elements: meter[value="62"]
   {"name":"Expect 1 elements: meter[value=\"62\"]","action":"assertCount","locator":{"css":"meter[value=\"62\"]"},"value":1,"contains":false}
23. Navigate > Files & Media
   {"name":"Navigate > Files & Media","action":"menu","contains":false,"menuPath":["Navigate","Files & Media"],"menuSource":"native"}
24. Expect page-title = Upload center
   {"name":"Expect page-title = Upload center","action":"assertText","locator":{"testId":"page-title"},"value":"Upload center","contains":false}
25. Open files/preview
   {"name":"Open files/preview","action":"click","locator":{"testId":"nav-files-preview"},"contains":false}
26. Expect page-title = Frames & media
   {"name":"Expect page-title = Frames & media","action":"assertText","locator":{"testId":"page-title"},"value":"Frames & media","contains":false}
27. Click Change canvas signal
   {"name":"Click Change canvas signal","action":"click","locator":{"role":"button","name":"Change canvas signal"},"contains":false}
28. Expect #canvas-result text
   {"name":"Expect #canvas-result text","action":"assertText","locator":{"css":"#canvas-result"},"value":"Signal level 2","contains":false}
29. Local audio asset exists
   {"name":"Local audio asset exists","target":"api","kind":"api","method":"GET","path":"/sample.wav","headers":{},"expect":{"status":200,"checks":[{"path":"headers.content-type","equals":"audio/wav"}],"allowSoapFault":false},"capture":{}}

## SUP04 — Rich text value appears in valid project result

Outcome: passed. Requirements: SUP04.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Forms
   {"name":"Navigate > Forms","action":"menu","contains":false,"menuPath":["Navigate","Forms"],"menuSource":"native"}
3. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
4. Open forms/validation
   {"name":"Open forms/validation","action":"click","locator":{"testId":"nav-forms-validation"},"contains":false}
5. Expect page-title = Validation & editor
   {"name":"Expect page-title = Validation & editor","action":"assertText","locator":{"testId":"page-title"},"value":"Validation & editor","contains":false}
6. Fill Project code
   {"name":"Fill Project code","action":"fill","locator":{"label":"Project code"},"value":"ABC-123","contains":false}
7. Fill Secure passphrase
   {"name":"Fill Secure passphrase","action":"fill","locator":{"label":"Secure passphrase"},"value":"12345678","contains":false}
8. Fill Confirm passphrase
   {"name":"Fill Confirm passphrase","action":"fill","locator":{"label":"Confirm passphrase"},"value":"12345678","contains":false}
9. Fill Release notes
   {"name":"Fill Release notes","action":"fill","locator":{"label":"Release notes"},"value":"Acceptance rich text note","contains":false}
10. Click Validate project
   {"name":"Click Validate project","action":"click","locator":{"role":"button","name":"Validate project"},"contains":false}
11. Expect page-result = Release notes: Acceptance rich text note
   {"name":"Expect page-result = Release notes: Acceptance rich text note","action":"assertText","locator":{"testId":"page-result"},"value":"Release notes: Acceptance rich text note","contains":true}

## SUP05 — Preferences save real theme, compact mode, locale and notification values

Outcome: passed. Requirements: SUP05.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Settings
   {"name":"Navigate > Settings","action":"menu","contains":false,"menuPath":["Navigate","Settings"],"menuSource":"native"}
3. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
4. Open settings/preferences
   {"name":"Open settings/preferences","action":"click","locator":{"testId":"nav-settings-preferences"},"contains":false}
5. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
6. Select Theme = dark
   {"name":"Select Theme = dark","action":"select","locator":{"label":"Theme"},"value":"dark","contains":false}
7. Select Locale = en-GB
   {"name":"Select Locale = en-GB","action":"select","locator":{"label":"Locale"},"value":"en-GB","contains":false}
8. Check Compact table rows
   {"name":"Check Compact table rows","action":"check","locator":{"label":"Compact table rows"},"contains":false}
9. Uncheck Workspace notifications
   {"name":"Uncheck Workspace notifications","action":"uncheck","locator":{"label":"Workspace notifications"},"contains":false}
10. Click Save preferences
   {"name":"Click Save preferences","action":"click","locator":{"role":"button","name":"Save preferences"},"contains":false}
11. Expect page-result = Preferences saved
   {"name":"Expect page-result = Preferences saved","action":"assertText","locator":{"testId":"page-result"},"value":"Preferences saved","contains":false}
12. Expect 1 elements: body.dark.compact
   {"name":"Expect 1 elements: body.dark.compact","action":"assertCount","locator":{"css":"body.dark.compact"},"value":1,"contains":false}
13. Preferences persisted in backend
   {"name":"Preferences persisted in backend","target":"api","kind":"api","method":"GET","path":"/api/state","headers":{},"expect":{"status":200,"checks":[{"path":"body.preferences.theme","equals":"dark"},{"path":"body.preferences.locale","equals":"en-GB"},{"path":"body.preferences.notifications","equals":false},{"path":"body.preferences.compact","equals":true}],"allowSoapFault":false},"capture":{}}

## SUP06 — A new owned launch reads persisted preferences, customer and order

Outcome: passed. Requirements: SUP05, LAB05, LAB13, LAB16.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Settings
   {"name":"Navigate > Settings","action":"menu","contains":false,"menuPath":["Navigate","Settings"],"menuSource":"native"}
3. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
4. Open settings/preferences
   {"name":"Open settings/preferences","action":"click","locator":{"testId":"nav-settings-preferences"},"contains":false}
5. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
6. Expect Theme value
   {"name":"Expect Theme value","action":"assertValue","locator":{"label":"Theme"},"value":"dark","contains":false}
7. Expect Locale value
   {"name":"Expect Locale value","action":"assertValue","locator":{"label":"Locale"},"value":"en-GB","contains":false}
8. Compact preference persists
   {"name":"Compact preference persists","action":"assertChecked","locator":{"label":"Compact table rows"},"value":true,"contains":false}
9. Expect 1 elements: body.dark.compact
   {"name":"Expect 1 elements: body.dark.compact","action":"assertCount","locator":{"css":"body.dark.compact"},"value":1,"contains":false}
10. Order persisted across launch
   {"name":"Order persisted across launch","target":"api","kind":"api","method":"GET","path":"/api/state","headers":{},"expect":{"status":200,"checks":[{"path":"body.orders.0.amount","equals":640}],"allowSoapFault":false},"capture":{}}
11. Navigate > Records
   {"name":"Navigate > Records","action":"menu","contains":false,"menuPath":["Navigate","Records"],"menuSource":"native"}
12. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
13. Open records/customers
   {"name":"Open records/customers","action":"click","locator":{"testId":"nav-records-customers"},"contains":false}
14. Expect page-title = Customers
   {"name":"Expect page-title = Customers","action":"assertText","locator":{"testId":"page-title"},"value":"Customers","contains":false}
15. Fill Search customers
   {"name":"Fill Search customers","action":"fill","locator":{"label":"Search customers"},"value":"API Acceptance Customer","contains":false}
16. Expect 1 elements: [data-testid="customer-row"]
   {"name":"Expect 1 elements: [data-testid=\"customer-row\"]","action":"assertCount","locator":{"css":"[data-testid=\"customer-row\"]"},"value":1,"contains":false}

## SUP07 — Command search and activity filtering expose specific results

Outcome: passed. Requirements: SUP06.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Click Search pages
   {"name":"Click Search pages","action":"click","locator":{"role":"button","name":"Search pages"},"contains":false}
3. Fill observed search input
   {"name":"Fill observed search input","action":"fill","locator":{"css":"#page-search"},"value":"Registration","contains":false}
4. Choose observed page search result
   {"name":"Choose observed page search result","action":"click","locator":{"css":"#search-results a[href=\"#forms/registration\"]"},"contains":false}
5. Expect page-title = Registration form
   {"name":"Expect page-title = Registration form","action":"assertText","locator":{"testId":"page-title"},"value":"Registration form","contains":false}
6. Navigate > Workspace
   {"name":"Navigate > Workspace","action":"menu","contains":false,"menuPath":["Navigate","Workspace"],"menuSource":"native"}
7. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
8. Open workspace/activity
   {"name":"Open workspace/activity","action":"click","locator":{"testId":"nav-workspace-activity"},"contains":false}
9. Expect page-title = Activity log
   {"name":"Expect page-title = Activity log","action":"assertText","locator":{"testId":"page-title"},"value":"Activity log","contains":false}
10. Fill Filter events
   {"name":"Fill Filter events","action":"fill","locator":{"label":"Filter events"},"value":"Form submitted: Acceptance Tester","contains":false}
11. Expect 1 elements: #event-list .activity-item
   {"name":"Expect 1 elements: #event-list .activity-item","action":"assertCount","locator":{"css":"#event-list .activity-item"},"value":1,"contains":false}
12. Expect #event-list text
   {"name":"Expect #event-list text","action":"assertText","locator":{"css":"#event-list"},"value":"Form submitted: Acceptance Tester","contains":true}
13. Fill Filter events
   {"name":"Fill Filter events","action":"fill","locator":{"label":"Filter events"},"value":"No matching synthetic event 987654","contains":false}
14. Expect 0 elements: #event-list .activity-item
   {"name":"Expect 0 elements: #event-list .activity-item","action":"assertCount","locator":{"css":"#event-list .activity-item"},"value":0,"contains":false}

## SUP08 — Slow request can cancel and then recover successfully

Outcome: passed. Requirements: SUP07.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Workflows
   {"name":"Navigate > Workflows","action":"menu","contains":false,"menuPath":["Navigate","Workflows"],"menuSource":"native"}
3. Expect page-title = Task board
   {"name":"Expect page-title = Task board","action":"assertText","locator":{"testId":"page-title"},"value":"Task board","contains":false}
4. Open workflows/requests
   {"name":"Open workflows/requests","action":"click","locator":{"testId":"nav-workflows-requests"},"contains":false}
5. Expect page-title = Async & recovery
   {"name":"Expect page-title = Async & recovery","action":"assertText","locator":{"testId":"page-title"},"value":"Async & recovery","contains":false}
6. Select Response scenario = Slow response
   {"name":"Select Response scenario = Slow response","action":"select","locator":{"label":"Response scenario"},"value":"Slow response","contains":false}
7. Click Send request
   {"name":"Click Send request","action":"click","locator":{"role":"button","name":"Send request"},"contains":false}
8. Click Cancel request
   {"name":"Click Cancel request","action":"click","locator":{"role":"button","name":"Cancel request"},"contains":false}
9. Expect request-response = Request cancelled
   {"name":"Expect request-response = Request cancelled","action":"assertText","locator":{"testId":"request-response"},"value":"Request cancelled","contains":false}
10. Expected enabled=true: Send request
   {"name":"Expected enabled=true: Send request","action":"assertEnabled","locator":{"role":"button","name":"Send request"},"value":true,"contains":false}
11. Expected enabled=false: Cancel request
   {"name":"Expected enabled=false: Cancel request","action":"assertEnabled","locator":{"role":"button","name":"Cancel request"},"value":false,"contains":false}
12. Select Response scenario = Success
   {"name":"Select Response scenario = Success","action":"select","locator":{"label":"Response scenario"},"value":"Success","contains":false}
13. Click Send request
   {"name":"Click Send request","action":"click","locator":{"role":"button","name":"Send request"},"contains":false}
14. Expect request-response = Request completed successfully
   {"name":"Expect request-response = Request completed successfully","action":"assertText","locator":{"testId":"request-response"},"value":"Request completed successfully","contains":true}

## SAFE01 — Test-mode reset requires confirmation, cancellation preserves data, confirmed reset restores seed

Outcome: passed. Requirements: SAFE01.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Settings
   {"name":"Navigate > Settings","action":"menu","contains":false,"menuPath":["Navigate","Settings"],"menuSource":"native"}
3. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
4. Open settings/runtime
   {"name":"Open settings/runtime","action":"click","locator":{"testId":"nav-settings-runtime"},"contains":false}
5. Expect page-title = Runtime & test data
   {"name":"Expect page-title = Runtime & test data","action":"assertText","locator":{"testId":"page-title"},"value":"Runtime & test data","contains":false}
6. Click Reset test data
   {"name":"Click Reset test data","action":"click","locator":{"role":"button","name":"Reset test data"},"contains":false}
7. Click Cancel
   {"name":"Click Cancel","action":"click","locator":{"role":"button","name":"Cancel"},"contains":false}
8. Cancelled reset preserved synthetic customer
   {"name":"Cancelled reset preserved synthetic customer","target":"api","kind":"api","method":"GET","path":"/api/customers?q=API%20Acceptance%20Customer","headers":{},"expect":{"status":200,"checks":[{"path":"body.total","equals":1}],"allowSoapFault":false},"capture":{}}
9. Click Reset test data
   {"name":"Click Reset test data","action":"click","locator":{"role":"button","name":"Reset test data"},"contains":false}
10. Click Reset data
   {"name":"Click Reset data","action":"click","locator":{"role":"button","name":"Reset data"},"contains":false}
11. Reset modal closed
   {"name":"Reset modal closed","action":"assertCount","locator":{"css":"#app-dialog[open]"},"value":0,"contains":false}
12. Confirmed reset restores all seeded state
   {"name":"Confirmed reset restores all seeded state","target":"api","kind":"api","method":"GET","path":"/api/state","headers":{},"expect":{"status":200,"checks":[{"path":"body.customers.length","equals":18},{"path":"body.orders.length","equals":8},{"path":"body.tasks.length","equals":3},{"path":"body.uploads.length","equals":0},{"path":"body.preferences.theme","equals":"light"}],"allowSoapFault":false},"capture":{}}

## SAFE02 — Without --test-mode, UI/native reset are unavailable and backend reset returns 403

Outcome: passed. Requirements: SAFE02.

1. Expect page-title = A workspace built to be tested.
   {"name":"Expect page-title = A workspace built to be tested.","action":"assertText","locator":{"testId":"page-title"},"value":"A workspace built to be tested.","contains":false}
2. Navigate > Settings
   {"name":"Navigate > Settings","action":"menu","contains":false,"menuPath":["Navigate","Settings"],"menuSource":"native"}
3. Expect page-title = Preferences
   {"name":"Expect page-title = Preferences","action":"assertText","locator":{"testId":"page-title"},"value":"Preferences","contains":false}
4. Open settings/runtime
   {"name":"Open settings/runtime","action":"click","locator":{"testId":"nav-settings-runtime"},"contains":false}
5. Expect page-title = Runtime & test data
   {"name":"Expect page-title = Runtime & test data","action":"assertText","locator":{"testId":"page-title"},"value":"Runtime & test data","contains":false}
6. Expected enabled=false: Reset test data
   {"name":"Expected enabled=false: Reset test data","action":"assertEnabled","locator":{"role":"button","name":"Reset test data"},"value":false,"contains":false}
7. Backend rejects reset outside test mode
   {"name":"Backend rejects reset outside test mode","target":"apiOff","kind":"api","method":"POST","path":"/api/reset","headers":{},"expect":{"status":403,"checks":[{"path":"body.error","equals":"Reset is available only in test mode"}],"allowSoapFault":false},"capture":{}}

## CONN01 — Owned launch reports real runtime and native menu discovery

Outcome: passed. Requirements: CONN01.

1. Read the actual owned session_info and ui_menus results.
2. Assert electron-launch, ownership owned, nativeElectronMenus true, seven native menu roots and actual Electron/Chromium versions.

## CONN02 — CDP reports attached renderer-only capabilities and rejects native Menu API

Outcome: passed. Requirements: CONN02.

1. Spawn a new test instance with a fresh data directory and --remote-debugging-port=0.
2. Attach to the observed loopback WebSocket endpoint through MCP.
3. Read session_info and ui_windows. Assert attached ownership and false mainProcess/nativeElectronMenus.
4. Request an explicit native menu action and assert MCP returns a capability error.

## CONN03 — CDP detach preserves app and current entered value on reconnect

Outcome: passed. Requirements: CONN03.

1. Enter a synthetic registration name through CDP.
2. Close only the attached MCP session. Assert the application process remains alive.
3. Reconnect to the same endpoint and assert the entered name remains unchanged.

## NATIVE01 — Explicit Windows UIA cancels an observed real OS message dialog

Outcome: passed. Requirements: CONN04.

1. Open the actual native message dialog from the renderer.
2. Explicitly attach a kind: desktop MCP session to the owned process PID.
3. Read the real Windows UIA snapshot and capture a screenshot.
4. Click the uniquely observed Cancel button and detach UIA.
5. Assert the renderer reports Native action cancelled.

## NATIVE02 — Explicit Windows UIA cancels an observed real OS file picker

Outcome: passed. Requirements: CONN04.

1. Open the actual OS file picker.
2. Explicitly attach Windows UIA to the owned PID.
3. Read observed native controls and capture a screenshot.
4. Click the observed Cancel button.
5. Assert the renderer reports Native file selection cancelled.

## SAFE03 — Packaged configuration retains isolation, sandbox, web security and loopback binding

Outcome: passed. Requirements: SAFE03.

1. Read the packaged main-process and backend source, rather than development-source assumptions.
2. Assert contextIsolation true, nodeIntegration false, sandbox true and webSecurity true.
3. Assert backend listener and optional CDP configuration bind to 127.0.0.1.
4. Record observed loopback renderer/CDP URLs. This is a configuration audit; it is not exploit testing.

## NATIVE03 — HTML file chooser uses observed UIA controls; upload persists and downloads identical bytes

Outcome: passed. Requirements: SUP01, CONN04.

1. Create uia-upload-fixture.txt containing only synthetic text inside the report folder.
2. Open the HTML upload chooser and explicitly attach Windows UIA.
3. Observe the File name editor and Open split button. Fill the fixture path and invoke the observed Open control.
4. Assert the renderer shows the fixture filename before submitting the upload.
5. Click Upload selected file and assert the saved filename.
6. Use MCP api_request to read persisted upload metadata and download the file, comparing exact bytes.

## MAN01 — CSV download and selected-row CSV content

Outcome: not-run. Requirements: Supplementary CSV selection exports.

The MCP 0.5.0 typed actions do not expose a browser download-event capture/save-path action. Native JSON export bytes were independently verified.

1. Select five current-page rows in the advanced grid. Export selected and save inside a dedicated test output directory.
2. Parse selected-customers.csv and assert exactly five data records, the six expected columns, matching selected customer IDs and valid escaping.
3. Download all-customer CSV and verify its records against the current REST customer state.

Expected: Downloaded bytes parse correctly and correspond to the selected/all current records.

## MAN02 — Physical task drag-and-drop gesture

Outcome: not-run. Requirements: Supplementary task drag and drop.

The MCP 0.5.0 typed UI action schema has no drag action. The accessible keyboard alternative passed.

1. Create a synthetic task in To do.
2. Physically drag its card to Done using observed UI coordinates.
3. Read REST state and assert the same task ID now has lane Done.
4. Reload the board and confirm the card remains in Done.

Expected: The gesture updates persistent state. Keyboard alternative is already covered by SUP02.

## MAN03 — Audible playback and canvas pixel changes

Outcome: not-run. Requirements: Supplementary canvas/audio.

SUP03 verified the audio asset, canvas equivalent action, progress and meter. It did not assert audible output or compare pixels; no visual baseline was created.

1. Play, pause and seek the local audio sample and observe actual audible output/playback time.
2. Capture canvas pixels before and after Change canvas signal and inspect the signal rendering.

Expected: The local audio plays and controls work; the canvas visual changes consistently with its accessible signal level.

## MAN04 — Rich text bold and italic formatting

Outcome: not-run. Requirements: Supplementary rich text.

SUP04 verified contenteditable input and submitted text. Character-range formatting was not exercised by the typed MCP suite.

1. Enter synthetic release notes. Select a text range and apply Bold selected text and Italic selected text.
2. Verify the selected characters visibly use the expected formatting and that other characters remain unchanged.
3. Submit a valid project and verify the resulting release-note text.

Expected: Formatting applies to the selected range and the textual result remains correct.

