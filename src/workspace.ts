import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
export class Workspace {
  readonly root: string;
  constructor(root = process.env.TESTWEAVE_WORKSPACE || process.cwd()) { this.root = resolve(root); }
  path(name: string): string {
    const path = resolve(this.root, name), rel = relative(this.root, path);
    if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) throw new Error('Path must stay inside TESTWEAVE_WORKSPACE');
    return path;
  }
  async safe(name: string): Promise<string> {
    const path = this.path(name), root = await realpath(this.root);
    let existing = path;
    while (true) {
      try {
        const actual = await realpath(existing), rel = relative(root, actual);
        if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) throw new Error('Symlink escapes TESTWEAVE_WORKSPACE');
        break;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
        existing = dirname(existing);
      }
    }
    return path;
  }
  async read(name: string): Promise<string> { return readFile(await this.safe(name), 'utf8'); }
  async write(name: string, content: string): Promise<string> {
    const path = await this.safe(name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, 'utf8');
    return path;
  }
}
