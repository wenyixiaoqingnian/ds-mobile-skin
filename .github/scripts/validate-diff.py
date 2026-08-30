#!/usr/bin/env python3
"""Static sanity check for a unified diff.

Used by CI as a fallback when the third-party plugin being patched
(`dsh-token-viewer`) is not on the public npm registry, so we can't run
the end-to-end apply. This script verifies the diff:

  * parses cleanly (`@@` hunk headers with sane line counts)
  * has at least one hunk
  * every hunk's *declared* line counts match reality. In a unified diff
    the `-N[,M]` / `+N[,M]` in the `@@` header count *all* lines the
    hunk touches, including context lines (lines starting with a space).
    So for each hunk body:

        removes + context == old_count
        adds    + context == new_count

    A mismatch means lines were silently dropped or duplicated while
    editing the diff (context counts must match on both sides too).

This is the authoritative "no lines lost" check. It does NOT verify that
the diff actually applies to a specific file — that requires the real
upstream file, which we can't fetch in CI. Run
`bash patches/dsh-token-viewer/apply-patch.sh` locally for the real test.
"""
import re, sys, os

DIFF = "patches/dsh-token-viewer/client.js.diff"

if not os.path.isfile(DIFF):
    print(f"ERROR: {DIFF} not found")
    sys.exit(1)

lines = open(DIFF, encoding="utf-8").read().splitlines()

# Find hunk-header line indices.
hunk_idx = [i for i, ln in enumerate(lines) if ln.startswith("@@")]
if not hunk_idx:
    print("ERROR: no @@ hunks found in diff")
    sys.exit(1)

fail = False
for n, hi in enumerate(hunk_idx):
    m = re.match(r"^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@", lines[hi])
    if not m:
        print(f"ERROR: hunk {n+1} header unparseable: {lines[hi]!r}")
        fail = True
        continue
    old_count = int(m.group(2) or 1)
    new_count = int(m.group(4) or 1)

    # Body lines: from the line after the header up to the next header.
    body = lines[hi + 1 : (hunk_idx[n + 1] if n + 1 < len(hunk_idx) else len(lines))]
    adds = sum(1 for ln in body if ln.startswith("+"))
    removes = sum(1 for ln in body if ln.startswith("-"))
    ctx = sum(1 for ln in body if ln and not ln.startswith(("+", "-")))

    ok = (removes + ctx == old_count) and (adds + ctx == new_count)
    if not ok:
        print(f"ERROR: hunk {n+1} header/body mismatch: "
              f"header -{old_count}/+{new_count}, "
              f"body {removes}-/{adds}+/{ctx} ctx")
        fail = True
    else:
        print(f"  hunk ok (-{old_count}/+{new_count}; body {removes}-/{adds}+/{ctx} ctx)")

if fail:
    print(f"FAIL: {len(hunk_idx)} hunk(s), at least one header/body mismatch")
    sys.exit(1)

print(f"OK: {len(hunk_idx)} hunk(s) parsed cleanly, all headers match bodies")
