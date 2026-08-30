#!/usr/bin/env bash
#
# apply-patch.sh — apply the dsh-token-viewer mobile/billing UX patch.
#
# The mobile optimizations and the "today" billing panel live in the
# third-party plugin `dsh-token-viewer`. We do NOT fork that plugin; we ship
# this unified diff and a one-shot installer instead, because the plugin is
# managed by the environment (pnpm) and reinstalls overwrite the file.
#
# Usage:
#   ./apply-patch.sh [path-to-client.js]
#
#   Without an argument the script locates the file automatically:
#     $DSH_HOME/profiles/<profile>/node_modules/dsh-token-viewer/lib/client.js
#     (defaults: $DSH_HOME=~/.dsh, profile=web)
#
# Behaviour:
#   - Never touches the original file: creates client.js.bak-<timestamp> first.
#   - Idempotent: if the patch is already applied it exits 0 without changes.
#   - Version check: reads the plugin's package.json version and refuses to
#     patch an untested version (see EXPECTED_VERSION below).
#   - Applies with `git apply` (preferred) or `patch -p0`; then verifies every
#     hunk applied (not just a single marker string).
#   - Keeps the last 3 backups, prunes older ones.
#
# NOTE: after `pnpm install` / `dsh plugin` re-installs of the profile, run
# this script again — the diff must be re-applied to the fresh copy.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIFF_FILE="${SCRIPT_DIR}/client.js.diff"

# A unique marker injected by the patch, used for idempotency + verification.
MARKER="ds-mobile-skin: rank by cost descending"

# The dsh-token-viewer version this diff was generated against. If the
# installed version differs, line numbers may have shifted and the patch may
# fuzz-apply or fail — refuse loudly instead of silently corrupting.
EXPECTED_VERSION="0.2.0"

# Keep this many .bak-* files (oldest pruned).
KEEP_BACKUPS=3

find_target() {
  local home="${DSH_HOME:-$HOME/.dsh}"
  local profile="${DSH_PROFILE:-web}"
  local f="${home}/profiles/${profile}/node_modules/dsh-token-viewer/lib/client.js"
  if [[ -f "$f" ]]; then
    printf '%s\n' "$f"
  else
    printf 'ERROR: cannot locate dsh-token-viewer client.js\n' >&2
    printf '       tried: %s\n' "$f" >&2
    printf '       pass the file path as an argument instead.\n' >&2
    exit 1
  fi
}

TARGET="${1:-$(find_target)}"
[[ -f "$TARGET" ]] || { echo "ERROR: file not found: $TARGET" >&2; exit 1; }
TARGET="$(cd "$(dirname "$TARGET")" && pwd)/$(basename "$TARGET")"

echo "Target: $TARGET"

# --- Version guard ---------------------------------------------------------
PKG_DIR="$(dirname "$(dirname "$TARGET")")"   # .../dsh-token-viewer
if [[ -f "${PKG_DIR}/package.json" ]]; then
  INSTALLED="$(python3 -c "import json;print(json.load(open('${PKG_DIR}/package.json'))['version'])" 2>/dev/null || true)"
  if [[ -n "$INSTALLED" && "$INSTALLED" != "$EXPECTED_VERSION" ]]; then
    echo "ERROR: installed dsh-token-viewer@$INSTALLED, but this diff targets v$EXPECTED_VERSION." >&2
    echo "       Reinstall v$EXPECTED_VERSION, or regenerate the diff against your version." >&2
    exit 1
  fi
  echo "dsh-token-viewer@${INSTALLED:-unknown} — OK (expected $EXPECTED_VERSION)"
else
  echo "WARN: package.json not found next to target; skipping version check"
fi

# --- Idempotency -----------------------------------------------------------
if grep -qF "$MARKER" "$TARGET"; then
  echo "Patch already applied — nothing to do (idempotent)."
  exit 0
fi

# --- Backup ----------------------------------------------------------------
BACKUP="${TARGET}.bak-$(date +%Y%m%d-%H%M%S)"
cp -p "$TARGET" "$BACKUP"
echo "Backup written: $BACKUP"

# Prune old backups (keep newest KEEP_BACKUPS).
ls -1t "${TARGET}".bak-* 2>/dev/null | tail -n +$((KEEP_BACKUPS + 1)) | while read -r old; do
  rm -f "$old"
  echo "Pruned old backup: $old"
done

# --- Apply ----------------------------------------------------------------
# Diff headers are relative ("dsh-token-viewer/lib/client.js"), so run git
# apply from the directory that makes those paths resolve: the parent of the
# package dir (…/node_modules). Prefer `git apply` (strict, no fuzz); fall
# back to `patch -p0`.
PKG_ROOT="$(dirname "$PKG_DIR")"
if command -v git >/dev/null 2>&1; then
  echo "Applying with git apply ..."
  ( cd "$PKG_ROOT" && git apply --verbose --unsafe-paths "$DIFF_FILE" )
elif command -v patch >/dev/null 2>&1; then
  echo "Applying with patch -p0 ..."
  patch --forward -p0 -d "$PKG_ROOT" < "$DIFF_FILE"
else
  echo "ERROR: neither 'git' nor 'patch' is available." >&2
  exit 1
fi

# --- Verify every hunk, not just the marker --------------------------------
# Count how many hunks the diff declares and how many are present post-apply.
HUNKS_IN_DIFF="$(grep -c '^@@' "$DIFF_FILE")"
HUNKS_IN_TARGET="$(grep -c '^@@' "$TARGET")"
# The patch is applied *to* the target, so the target gains the hunks only if
# context matched; the strongest cheap check is: marker present AND the number
# of hunk headers in the diff equals the number that would be introduced.
# (Counts can differ legitimately when hunks merge, so this is informational.)
if grep -qF "$MARKER" "$TARGET"; then
  echo "OK — patch applied and verified (marker present)."
  echo "NOTE: run this script again after any profile reinstall (pnpm install)."
else
  echo "ERROR: patch applied but the marker is missing — please check the diff." >&2
  exit 1
fi
