// Lets `import './content'` (no extension, Vite-style) resolve to ./content.ts
import {existsSync} from 'fs';
import {fileURLToPath, pathToFileURL} from 'url';
import {dirname, resolve as presolve} from 'path';

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
    const base = dirname(fileURLToPath(context.parentURL));
    for (const ext of ['.ts', '.tsx', '.js']) {
      const p = presolve(base, specifier + ext);
      if (existsSync(p)) return next(pathToFileURL(p).href, context);
    }
  }
  return next(specifier, context);
}
