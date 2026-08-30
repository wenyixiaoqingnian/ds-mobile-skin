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
#   - Verifies the result contains the patch marker afterwards.
#
# NOTE: after `pnpm install` / `dsh plugin` re-installs of the profile, run
# this script again — the diff must be re-applied to the fresh copy.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIFF_FILE="${SCRIPT_DIR}/client.js.diff"

# A unique marker injected by the patch, used for idempotency + verification.
MARKER="ds-mobile-skin: rank by cost descending"

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

if grep -qF "$MARKER" "$TARGET"; then
  echo "Patch already applied — nothing to do (idempotent)."
  exit 0
fi

BACKUP="${TARGET}.bak-$(date +%Y%m%d-%H%M%S)"
cp -p "$TARGET" "$BACKUP"
echo "Backup written: $BACKUP"

if command -v patch >/dev/null 2>&1; then
  patch --forward -p1 "$TARGET" < "$DIFF_FILE"
elif command -v git >/dev/null 2>&1; then
  git apply --unsafe-paths "$DIFF_FILE" -- "$TARGET"
else
  echo "ERROR: neither 'patch' nor 'git' is available." >&2
  exit 1
fi

if grep -qF "$MARKER" "$TARGET"; then
  echo "OK — patch applied and verified."
  echo "NOTE: run this script again after any profile reinstall (pnpm install)."
else
  echo "ERROR: patch applied but the marker is missing — please check the diff." >&2
  exit 1
fi
