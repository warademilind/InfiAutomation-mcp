# InfiComponent Lab acceptance requirements

This is a synthetic local application for testing InfiAutomation MCP 0.5.0. It is not a production customer system. The backend and renderer must exercise real workflows rather than static mock controls. Test data must remain isolated from other applications.

| ID | Required behavior |
| --- | --- |
| LAB01 | An owned packaged Electron launch opens the unique Workspace title and seven main navigation menu groups, each with three subpages. |
| LAB02 | Registration rejects missing required fields and saves a valid name, email and terms acceptance through the backend, displaying the submitted name. |
| LAB03 | Input controls expose observable values, including a keyboard-controlled slider, dates, multiple selection and a custom framework combobox. |
| LAB04 | Project validation enforces ABC-123 format, team size 1–20, an eight-character passphrase and matching confirmation. |
| LAB05 | Customers can be created, edited, searched and deleted through the renderer and persistent REST backend. |
| LAB06 | The advanced grid supports five-row selection and pagination over the eighteen seeded records. |
| LAB07 | Native File > Export > Export JSON writes a JSON file and reports its path; native View > Compact mode toggles a real state. |
| LAB08 | An explicit DOM File menu saves a note, double click produces a result, and the disabled action stays disabled. |
| LAB09 | Submitting the workspace note dialog displays the entered value. Cancelling closes it without saving. |
| LAB10 | Tabs switch visible panels and expanding the project tree allows Reports to be selected. |
| LAB11 | A same-origin iframe form and an open shadow-root form save independent feedback values. |
| LAB12 | Wrong credentials are rejected; tester@example.test / LabPass!2026 signs in; session read and logout work. |
| LAB13 | A three-step order workflow validates input and confirmation and creates a persistent order. |
| LAB14 | The intentional HTTP 503 scenario reports an error; switching to Success recovers; delayed content appears when ready. |
| LAB15 | Inspector opens in a separate uniquely titled renderer with an independently saved note, and selection can return to Workspace. |
| LAB16 | A customer created through the REST API appears as one matching row in the renderer. |

Supplementary application surfaces: file upload/download round trips, CSV selection exports, task drag and drop with a keyboard alternative, native OS message and file dialogs, tooltip/popover, progress/meter, canvas/audio, rich text, preference persistence, command search, activity filtering, async cancellation and guarded reset. These have separate checks or require interactive platform validation; mapping a smoke case is not a claim of exhaustive coverage.

Connection acceptance: owned Electron launch must support native menu discovery and actual runtime reporting. Optional CDP must expose only the local renderer, reject native Menu API use, and preserve the app when detached. Windows UIA must be selected explicitly for OS dialog presentation and must use observed Windows controls.

Safety and repeatability: use only synthetic data. Bind the backend and optional CDP endpoint to loopback. Keep context isolation, renderer sandboxing and web security enabled. Reset must be unavailable without --test-mode. Each automated run must use a new data directory; do not reset the user's normal profile. Healing must remain off. Do not create or approve visual baselines automatically.
