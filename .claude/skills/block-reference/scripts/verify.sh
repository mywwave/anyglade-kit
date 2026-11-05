#!/usr/bin/env bash
# Использование: verify.sh [порт] [блоки через запятую для скриншотов]
set -u

PORT="${1:-5170}"
IDS="${2:-}"
SKILL="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(git -C "$SKILL" rev-parse --show-toplevel)"
OUT="${TMPDIR:-${TEMP:-/tmp}}/kit-blocks-$PORT"

native() { command -v cygpath > /dev/null && cygpath -m "$1" || echo "$1"; }

for candidate in \
  "${BROWSER:-}" \
  "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  "/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "$(command -v google-chrome chromium microsoft-edge 2> /dev/null | head -1)"; do
  if [ -n "$candidate" ] && [ -x "$candidate" ]; then BROWSER_BIN="$candidate"; break; fi
done
[ -n "${BROWSER_BIN:-}" ] || { echo "Браузер не найден, задайте BROWSER"; exit 1; }

(cd "$ROOT/apps/playground" && vp build 2>&1 | grep -E 'rror:|built in') || exit 1

rm -rf "$OUT"
mkdir -p "$OUT/site" "$OUT/shots"
cp -r "$ROOT/apps/playground/dist/." "$OUT/site/"
cp "$SKILL/probe.js" "$OUT/site/probe.js"
sed -i 's#<head>#<head><script src="/probe.js"></script>#' "$OUT/site/index.html"
cat > "$OUT/site/phone.html" << 'EOF'
<!doctype html><body style="margin:0"><iframe id="f" width="390" height="1500" style="border:0"></iframe><pre id="out"></pre>
<script>
const f = document.getElementById("f");
f.src = "/" + location.search;
setTimeout(() => { document.getElementById("out").textContent = f.contentDocument.getElementById("probe")?.textContent ?? ""; }, 4000);
</script>
EOF

(cd "$OUT/site" && npx -y serve@14 -l "$PORT" . > "$OUT/serve.log" 2>&1 &)
for _ in $(seq 1 15); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/probe.js")" = 200 ] && break
  sleep 1
done

browser() {
  rm -rf "$OUT/profile"
  "$BROWSER_BIN" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --run-all-compositor-stages-before-draw --user-data-dir="$(native "$OUT/profile")" "$@" 2> /dev/null
}
dump() { sed -n "s#.*<pre id=\"$1\"[^>]*>\(.*\)</pre>.*#\1#p" | sed 's/&quot;/"/g; s/&gt;/>/g; s/&lt;/</g; s/&amp;/\&/g'; }

browser --window-size=1280,900 --virtual-time-budget=6000 --dump-dom "http://localhost:$PORT/?theme=dark" | dump probe > "$OUT/desktop.json"
browser --window-size=700,900 --virtual-time-budget=9000 --dump-dom "http://localhost:$PORT/phone?theme=dark" | dump out > "$OUT/phone.json"
node "$(native "$SKILL/report.mjs")" "$(native "$OUT/desktop.json")" "$(native "$OUT/phone.json")"

if [ -n "$IDS" ]; then
  for theme in light dark; do
    browser --window-size=1280,1400 --virtual-time-budget=5000 \
      --screenshot="$(native "$OUT/shots/desktop-$theme.png")" "http://localhost:$PORT/?theme=$theme&only=$IDS" > /dev/null
  done
  browser --window-size=500,1500 --virtual-time-budget=9000 \
    --screenshot="$(native "$OUT/shots/phone-dark.png")" "http://localhost:$PORT/phone?theme=dark&only=$IDS" > /dev/null
  echo
  echo "Скриншоты: $(native "$OUT/shots")"
fi

if command -v netstat > /dev/null && command -v taskkill > /dev/null; then
  netstat -ano | grep ":$PORT " | grep LISTENING | awk '{print $5}' | sort -u | while read -r pid; do
    taskkill //PID "$pid" //T //F > /dev/null 2>&1
  done
else
  pkill -f "serve@14 -l $PORT" 2> /dev/null
fi
rm -rf "$OUT/profile"
