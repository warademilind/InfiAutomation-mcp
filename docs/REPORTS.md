# Reading the HTML reports

Open a run's `index.html` in a modern browser. Keep the entire report folder together: HTML pages link to their recorded screenshots, trace ZIPs, JSON and requirement mappings. The report needs no web server or external scripts.

The report UI in **0.3.2** keeps the header and section area steady when switching menus. Navigation selects persistent panels; it preserves the test explorer's search, outcome filter, sorting and page. Reduced-motion preferences disable transitions.

Reports also adapt when embedded in an iframe, avoiding a viewport-height resize feedback loop in clients that automatically size the frame to its contents.

| Section | What to do |
| --- | --- |
| Overview | Review clean passes, failures, recorded duration, execution health, runtime context, slowest cases and outcomes needing attention. Select a case to inspect its evidence. |
| Test explorer | Search names, IDs, tags or requirement references; filter by outcome; sort by execution order, name or duration. Use 10, 25 or 50 rows per page. Reset filters when no cases match. |
| Healing audit | Review actual locator-repair records, whether applied or only proposed, and compare the original and proposed locators. Open the related case. No records means none were recorded; it does not establish whether healing was enabled. |
| Environment | Inspect the run ID, recorded start, target, platform and runtime versions. Expand the raw environment JSON or copy the run ID. |

## Case and screenshot drill-down

Select a test name or its inspect button. The details panel shows its outcome, duration, requirement references, tags, errors, steps and available evidence.

- Move through cases with **Previous** and **Next**. In the explorer, this follows the current filtered and sorted list.
- Use **Expand actual results** to open recorded action/assertion values together.
- Use **Failed steps** to focus on failed steps when present.
- Use **Expand image** to inspect a screenshot at a larger size, or select the image to open the original PNG.
- Use **Copy case link** to share a link ending in the case ID. Coverage reports use these same case links.
- Close with the close button, Escape or the overlay. Keyboard focus returns to the case you opened.

Image frames reserve their space before loading so screenshots do not push the surrounding steps around.

## Sharing, printing and upgrading

**JSON** exports the recorded run data. **Print view** prints the current section and, for the explorer, the currently shown page; the footer identifies its range. Switch to the desired section before printing. Clipboard permissions vary by browser; the Environment section also lets you select the run ID directly.

Generated HTML is a saved artifact. Installing a newer MCP version changes reports from subsequent runs; it does not rewrite existing HTML. The public [Calculator example](../examples/calculator/README.md) has been regenerated with the 0.3.2 renderer while preserving its original 0.3.1 execution data and privacy-cropped screenshot pixels.

Report renderer version and recorded runtime versions have different meanings. A refreshed interface does not imply the application tests were rerun.

Clean passes, healed outcomes, failures and skipped cases remain distinct. Requirement mapping is evidence of linked cases, not proof of complete business acceptance.
