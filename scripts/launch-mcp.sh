#!/bin/sh
# Resolve main to an immutable revision to avoid stale mutable-branch caches.
revision=$(git ls-remote https://github.com/louisje/terminal-mcp.git refs/heads/main) || exit 1
revision=${revision%%[[:space:]]*}
case "$revision" in
  *[!0-9a-f]*|'') echo "terminal-mcp: invalid Git revision" >&2; exit 1 ;;
esac
if [ "${#revision}" -ne 40 ]; then
  echo "terminal-mcp: invalid Git revision" >&2
  exit 1
fi
package="github:louisje/terminal-mcp#$revision"
if command -v bunx >/dev/null 2>&1; then
  exec bunx --package "$package" terminal-mcp --mcp
fi
exec npx --yes --package "$package" terminal-mcp --mcp
