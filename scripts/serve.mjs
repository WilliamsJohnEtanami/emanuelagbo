import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
};

const port = Number(process.env.WEBAR_PORT || 8080);

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
    const filePath = resolve(root, relativePath);
    if (filePath !== root && !filePath.startsWith(root + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (!(await stat(filePath)).isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    const extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    const headers = { 'Content-Type': contentTypes[extension] ?? 'application/octet-stream' };
    if (['.mp4', '.webm'].includes(extension)) {
      const range = request.headers.range;
      const size = (await stat(filePath)).size;
      headers['Accept-Ranges'] = 'bytes';
      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range);
        if (!match) {
          response.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end();
          return;
        }
        const start = match[1] ? Number(match[1]) : Math.max(size - Number(match[2]), 0);
        const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
        if (start > end || start >= size) {
          response.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }).end();
          return;
        }
        headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
        headers['Content-Length'] = end - start + 1;
        response.writeHead(206, headers);
        createReadStream(filePath, { start, end }).pipe(response);
        return;
      }
      headers['Content-Length'] = size;
      response.writeHead(200, headers);
      createReadStream(filePath).pipe(response);
      return;
    }
    const body = await readFile(filePath);
    response.writeHead(200, headers);
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Development server running at http://localhost:${port}`);
});
