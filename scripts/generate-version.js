/**
 * Génère public/version.json au moment du build.
 * Permet de vérifier quelle version est réellement déployée en visitant
 * https://<domaine>/version.json (fichier servi avec Cache-Control: no-cache).
 */
import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function resolveCommit() {
  // Vercel expose le SHA du commit déployé
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const commit = resolveCommit();
const version = {
  commit,
  short: commit.slice(0, 7),
  branch: process.env.VERCEL_GIT_COMMIT_REF || null,
  builtAt: new Date().toISOString(),
};

const outPath = join(__dirname, '..', 'public', 'version.json');
writeFileSync(outPath, JSON.stringify(version, null, 2) + '\n', 'utf8');
console.log('version.json généré:', version.short, version.builtAt);
