#!/usr/bin/env bash
#
# Prune stale Vite build artifacts from the react-app output dir.
#
# Removes *.js and *.js.map files that are BOTH:
#   1. NOT referenced by the current manifest.json, AND
#   2. last modified 30+ minutes ago (grace window so an in-flight deploy or a
#      just-opened tab can still load the chunk it asked for).
#
# A *.js.map is kept iff its matching *.js is referenced by the manifest
# (sourcemaps aren't listed in the manifest themselves).
#
# Usage:
#   scripts/prune-stale-build.sh                  # delete everything not in the manifest
#   scripts/prune-stale-build.sh --dry-run        # preview only, delete nothing
#   scripts/prune-stale-build.sh --grace          # also keep files newer than AGE_MINUTES
#   scripts/prune-stale-build.sh --dry-run --grace
#
# Default prunes by manifest membership alone (good for a manual local cleanup).
# Add --grace for the server cron, where you want to spare files newer than the
# AGE_MINUTES window so an in-flight deploy / just-opened tab isn't broken.
#
# Overridable via env:
#   BUILD_DIR=...      (default: <repo>/public/js/react-app)
#   MANIFEST=...       (default: $BUILD_DIR/.vite/manifest.json)
#   AGE_MINUTES=30     (grace window in minutes; ignored with --all)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

BUILD_DIR="${BUILD_DIR:-$REPO_ROOT/public/js/react-app}"
MANIFEST="${MANIFEST:-$BUILD_DIR/.vite/manifest.json}"
AGE_MINUTES="${AGE_MINUTES:-1440}"

DRY_RUN=0
USE_AGE=0          # default: prune everything not in the manifest, regardless of age
for arg in "$@"; do
    case "$arg" in
        --dry-run) DRY_RUN=1 ;;
        --grace)   USE_AGE=1 ;;   # apply the AGE_MINUTES window (use this for the server cron)
        --all)     USE_AGE=0 ;;   # explicit "ignore age" (now the default; kept for clarity)
        *) echo "ERROR: unknown argument: $arg" >&2; exit 1 ;;
    esac
done

command -v jq >/dev/null 2>&1 || { echo "ERROR: jq is required but not found." >&2; exit 1; }
[[ -d "$BUILD_DIR" ]]  || { echo "ERROR: build dir not found: $BUILD_DIR" >&2; exit 1; }
[[ -f "$MANIFEST" ]]   || { echo "ERROR: manifest not found: $MANIFEST" >&2; exit 1; }

# --- set of filenames the current build still references (basenames) ----------
# Collect every `file`, plus any `css[]` / `assets[]`, across all manifest entries.
KEEP="$(mktemp)"
trap 'rm -f "$KEEP"' EXIT
jq -r 'to_entries | map(.value | (.file, (.css[]?), (.assets[]?))) | flatten | .[]' "$MANIFEST" \
  | sed 's#.*/##' \
  | sort -u > "$KEEP"

# Safety: if we parsed nothing, abort rather than nuke the whole directory.
[[ -s "$KEEP" ]] || { echo "ERROR: no files parsed from manifest — aborting (would have deleted everything)." >&2; exit 1; }

# ---- DEBUG ----
echo "DEBUG BUILD_DIR  = $BUILD_DIR" >&2
echo "DEBUG MANIFEST   = $MANIFEST" >&2
echo "DEBUG USE_AGE    = $USE_AGE  AGE_MINUTES=$AGE_MINUTES" >&2
echo "DEBUG keep-set ($(wc -l < "$KEEP") files):" >&2
sed 's/^/  keep: /' "$KEEP" >&2
echo "DEBUG candidate files found by find:" >&2
{
    fa=("$BUILD_DIR" -maxdepth 1 -type f)
    [[ "$USE_AGE" == "1" ]] && fa+=(-mmin +"$AGE_MINUTES")
    find "${fa[@]}" -exec basename {} \; | sed 's/^/  found: /'
} >&2
echo "DEBUG ---- decisions ----" >&2
# ---- /DEBUG ----

# --- walk candidates: top-level *.js / *.js.map older than the grace window ----
deleted=0
kept=0
while IFS= read -r -d '' f; do
    base="$(basename "$f")"
    case "$base" in
        *.js.map) ref="${base%.map}" ;;  # chunk.X.js.map -> needs chunk.X.js
        *)        ref="$base" ;;
    esac

    if grep -Fxq -- "$ref" "$KEEP"; then
        echo "  KEEP   $base  (ref=$ref in manifest)" >&2
        kept=$((kept + 1))
        continue
    fi
    echo "  PRUNE  $base  (ref=$ref NOT in manifest)" >&2

    if [[ "$DRY_RUN" == "1" ]]; then
        echo "  would remove: $base"
    else
        rm -f -- "$f"
        echo "removed: $base"
    fi
    deleted=$((deleted + 1))
done < <(
    find_args=("$BUILD_DIR" -maxdepth 1 -type f)
    [[ "$USE_AGE" == "1" ]] && find_args+=(-mmin +"$AGE_MINUTES")
    find "${find_args[@]}" -print0
)

if [[ "$DRY_RUN" == "1" ]]; then
    echo "dry-run: $deleted stale file(s) would be removed, $kept still referenced/kept."
else
    echo "done: removed $deleted stale file(s), kept $kept referenced."
fi
