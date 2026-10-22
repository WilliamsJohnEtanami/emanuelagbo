import { readFile, mkdir, open, rename, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function withinRoot(path) {
  const target = resolve(root, path);
  if (!target.startsWith(root + sep)) throw new Error(`Invalid media path: ${path}`);
  return target;
}
const media = JSON.parse(await readFile(resolve(root, 'media/manifest.json'), 'utf8'));
for (const video of media) {
  const target = withinRoot(video.output);
  await mkdir(dirname(target), { recursive: true });
  const temporary = target + '.assembling';
  const handle = await open(temporary, 'w');
  const hash = createHash('sha256');
  let size = 0;
  try {
    for (const part of video.parts) {
      const data = await readFile(withinRoot(part.path));
      if (data.length !== part.size || createHash('sha256').update(data).digest('hex') !== part.sha256) {
        throw new Error(`Missing or damaged media part: ${part.path}`);
      }
      let offset = 0;
      while (offset < data.length) {
        const { bytesWritten } = await handle.write(data, offset, data.length - offset);
        if (!bytesWritten) throw new Error(`Could not write ${video.output}`);
        offset += bytesWritten;
      }
      hash.update(data);
      size += data.length;
    }
    if (size !== video.size || hash.digest('hex') !== video.sha256) {
      throw new Error(`Media integrity check failed: ${video.output}`);
    }
    await handle.close();
    await rename(temporary, target);
    console.log(`Ready: ${video.output}`);
  } catch (error) {
    await handle.close().catch(() => {});
    await rm(temporary, { force: true });
    throw error;
  }
}
console.log('Portfolio ready in dist/.');
