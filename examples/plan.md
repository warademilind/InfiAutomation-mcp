# Project workspace test plan

Goal: verify project persistence feedback and export navigation in the bundled fixture.

## Requirements

- **R01:** Saving a named project displays that project name in the status.
- **R02:** File → Export displays export feedback.

## Scenarios

### save-project · Create and save a project

Precondition: fresh fixture page.
1. Enter Launch as the project name.
2. Enable notifications and verify it is checked.
3. Choose High priority.
4. Save the project.
Expected: status text equals Saved Launch.

### export-project · Navigate File menu and export

Precondition: fresh fixture page.
1. Open File.
2. Choose Export.
Expected: status text equals Export ready.

The fixture has no validation or persistence beyond its current page. Those behaviors are not claimed or tested.
