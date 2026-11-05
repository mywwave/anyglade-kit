// Статический сервер для verify.sh. Завершается сам, даже если скрипт оборвали.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const [root, port] = process.argv.slice(2);
const LIFETIME_MS = 5 * 60 * 1000;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
};

function resolve(pathname) {
  if (pathname === "/") return "index.html";
  if (pathname === "/phone") return "phone.html";
  return decodeURIComponent(pathname.slice(1));
}

createServer((request, response) => {
  const { pathname } = new URL(request.url, "http://localhost");
  const file = join(root, normalize(resolve(pathname)));

  if (!file.startsWith(normalize(root)) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(Number(port));

setTimeout(() => process.exit(0), LIFETIME_MS);
