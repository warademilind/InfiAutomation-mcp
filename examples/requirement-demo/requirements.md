# Project form requirements

REQ-SAVE-001: After entering Launch and choosing Save project, the status must equal Saved Launch.
Acceptance: The project name appears exactly in the saved status on the current page.

REQ-EXPORT-002: File > Export must show Export ready in the status.
Acceptance: The menu must be observed from the live app and the Export action must produce the stated text.

REQ-NOTIFY-003: Enabling notifications must put the checkbox into the checked state.
Acceptance: The checkbox reports checked after selecting it.

Scope: this demonstration stores state only in the current HTML page. Reload persistence, server saves, authorization, blank-name validation and performance targets are unspecified. Ask the product owner before inventing rules for those behaviors.
