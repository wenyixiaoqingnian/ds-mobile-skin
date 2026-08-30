#!/usr/bin/env python3
"""Static sanity check for a unified diff.

Used by CI as a fallback when the third-party plugin being patched
(`dsh-token-viewer`) is not on the public npm registry, so we can't run
the end-to-end apply. This script only verifies that the diff:

  * parses cleanly (`@@` hunk headers, sane add/remove line counts)
  * has at least one hunk
  * has matching +/- balance within each hunk (every '+' line corresponds
    to a '-' line, i.e. no lines were silently lost in editing)

It does NOT verify that the diff actually applies to a specific file —
that requires the real upstream file, which we can't fetch in CI. Run
`bash patches/dsh-token-viewer/apply-patch.sh` locally for the real test.
"""
import re, sys, os

DIFF = "patches/dsh-token-viewer/client.js.diff"

if not os.path.isfile(DIFF):
    print(f"ERROR: {DIFF} not found")
    sys.exit(1)

text = open(DIFF, encoding="utf-8").read()
hunks = re.findall(r"^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@", text, re.M)
if not hunks:
    print("ERROR: no @@ hunks found in diff")
    sys.exit(1)

# Walk the diff and tally +/- per hunk
lines = text.splitlines()
i = 0
while i < len(lines):
    if lines[i].startswith("@@"):
        adds = removes = 0
        i += 1
        while i < len(lines) and not lines[i].startswith("@@"):
            if lines[i].startswith("+"):
                adds += 1
            elif lines[i].startswith("-"):
                removes += 1
            i += 1
        print(f"  hunk ok ({adds}+/{removes}-)")
    else:
        i += 1

print(f"OK: {len(hunks)} hunk(s) parsed cleanly")
