# InfiComponent Lab: requirements to Electron acceptance evidence

**[Open the live interactive walkthrough](https://warademilind.github.io/InfiAutomation-mcp/showcases/inficomponent-lab/)**. It includes the actual HTML reports, linked requirement sheet, generated plan/cases, step evidence and an embedded execution-video player. Download or clone this repository and keep the whole showcase folder together to use the reports locally.

The user supplied the packaged synthetic InfiComponent Lab app and the `acceptance-20261104-acceptance-rerun` artifacts. This publication does not redistribute the executable or internal client documentation. The executable's SHA-256, original source hashes and published artifact hashes are recorded in [provenance.json](provenance.json).

## Explore the evidence

| Stage | Readable view | Source / data |
| --- | --- | --- |
| Requirements | [Requirement sheet](requirements.html) | [Original, unmodified Markdown](REQUIREMENTS.md) |
| Plan | [Generated plan](acceptance-20261104-acceptance-rerun/test-plan.html) | [Markdown](acceptance-20261104-acceptance-rerun/test-plan.md), [JSON](acceptance-20261104-acceptance-rerun/test-plan.json) |
| Cases | [Searchable cases, actions and expectations](acceptance-20261104-acceptance-rerun/test-cases.html) | [Generated suite](acceptance-20261104-acceptance-rerun/test-cases.json), [case sheet](acceptance-20261104-acceptance-rerun/test-cases.md) |
| Acceptance | [Combined acceptance overview](acceptance-20261104-acceptance-rerun/index.html) | [Summary](acceptance-20261104-acceptance-rerun/summary.json), [execution manifest](acceptance-20261104-acceptance-rerun/execution-manifest.json) |
| Execution | [MCP summary](acceptance-20261104-acceptance-rerun/mcp-report/index.html), [detailed drill-down](acceptance-20261104-acceptance-rerun/mcp-report/detailed.html) | [Actual recorded results](acceptance-20261104-acceptance-rerun/mcp-report/results.json) |
| Coverage | [Requirement coverage](acceptance-20261104-acceptance-rerun/mcp-report/traceability.html) | [Traceability JSON](acceptance-20261104-acceptance-rerun/mcp-report/traceability.json) |
| History | [First attempt: 24 passed, 2 failed](acceptance-20261104-acceptance/mcp-report/index.html) | [Historical results](acceptance-20261104-acceptance/mcp-report/results.json) |
| Video | [Embedded player and chapters](index.html#video), [MP4](media/execution.mp4) | [Recording scope and source hashes](media/recording.json) |
| HTML walkthrough | [Embedded report-tour player](index.html#report-tour), [MP4](media/report-tour.mp4) | [Tour metadata](media/report-tour.json) |

## What passed and what remains open

The supplied final typed suite passed **26/26 cases**, with **523 recorded steps**, **504 captured screenshots**, healing off, no failed/healed/skipped cases, and an execution duration of **107.908 seconds**. Its start time was **4 November 2026, 09:56:25.644 UTC**. Seven additional connection/native checks passed separately. These are distinct checks, not 33 typed-suite cases.

Four manual cases remain explicitly **not run**: CSV download content, physical pointer drag/drop, audible playback/canvas pixel changes, and character-range rich-text formatting. Keyboard task movement and other supplementary assertions do not stand in for those missing checks. The [case sheet](acceptance-20261104-acceptance-rerun/test-cases.html) retains their reasons and expected outcomes.

## Actual execution video

The silent **154.1-second** video contains real renderer captures of **LAB01, LAB02 and LAB03**, joined only at case boundaries at their natural source playback speed. These three cases completed and passed during a separate recording attempt. Later video startup timeouts interrupted that attempt; it is **not** a video of the complete 26-case acceptance run. The supplied 26/26 report remains separate and unchanged in meaning.

The video shows actual navigation, validation, backend submission and input controls. It does not capture native OS menu/dialog presentation or prove audible playback. Chapter buttons seek to each recorded case. The capture uses a fresh isolated synthetic profile and loopback backend; the user's normal profile was not reset. See [recording.json](media/recording.json) for source clip hashes and scope.

A separate [HTML walkthrough video](media/report-tour.mp4) opens the actual requirement sheet, plan, case search/expansion, report summary/detail, coverage and execution-video player. Both videos are silent real captures. Generated browser previews in `previews/` show these published views and are distinct from the original execution screenshots.

## Privacy and publication changes

484 published renderer PNGs are byte-identical to their sources. Twenty final-run images showing machine runtime/export paths, and historical/OS captures with private folder listings, are withheld with explicit SVG placeholders. No replacement image is presented as an actual screenshot. Source hashes for withheld files are retained locally and in the publication manifest; original files remain untouched.

Machine paths in HTML/JSON/Markdown use generic test-workspace paths. These normalized copies preserve case IDs, assertions after path normalization, statuses, timings, requirement mapping and coverage gaps. Historical failure results are retained. The Word source and app binary are not redistributed. Screenshots are evidence, not approved visual baselines.

## Execute against your own copy of this synthetic app

Use Node.js 24+, InfiAutomation MCP 0.5.0 and your authorized local copy of `InfiComponentLab.exe`. Read the [Electron setup guide](https://github.com/warademilind/InfiAutomation-mcp/blob/main/docs/ELECTRON.md). Inspect your app's `session_info`, `ui_windows`, `ui_snapshot` and `ui_menus` before applying locators.

The published suite is a normalized record of this specific app, not a universal test suite. Before executing a copied suite, configure the real executable, fresh isolated data directories, available loopback ports/allowed origins, the exact expected export path and a workspace-local `planPath`. Keep the normal and no-test-mode targets in different isolated profiles. Preserve every assertion and keep healing off. Never point its reset checks at a normal profile.

Import the supplied requirements with `requirements_import`, read every chunk, save/verify the mapped plan, use `test_generate`, close inspection sessions, call `test_run`, poll `test_status`, and retrieve `report_get` and `traceability_get`. This is the same workflow evidenced here.

The showcase is outside the npm package's `files` list; normal MCP installation does not download this evidence gallery.
