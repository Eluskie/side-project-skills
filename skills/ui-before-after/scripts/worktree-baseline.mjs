#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Pin the worktree's original revision; never substitute the previous commit. */
export async function resolveWorktreeBaseline(repo, explicitRef) {
  const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
  const commit = (ref) => git('rev-parse', '--verify', `${ref}^{commit}`);
  const metadataPath = path.join(git('rev-parse', '--absolute-git-dir'), 'ui-review-baseline.json');
  const explicit = explicitRef ? commit(explicitRef) : undefined;
  let existing;
  try { existing = JSON.parse(await readFile(metadataPath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existing) {
    if (existing.version !== 1 || !existing.before) throw new Error(`Invalid original-worktree baseline: ${metadataPath}`);
    existing.before = commit(existing.before);
    if (explicit && explicit !== existing.before) throw new Error(`Before must match the pinned original worktree revision ${existing.before.slice(0, 9)}`);
    return existing;
  }

  let creation;
  try {
    const log = await readFile(git('rev-parse', '--path-format=absolute', '--git-path', 'logs/HEAD'), 'utf8');
    // An oldest remaining reflog entry is not enough: require the actual birth
    // entry, whose previous object ID is all zeros, to avoid a moving baseline.
    const firstEntry = log.split('\n')[0].match(/^(0{40}|0{64}) ([0-9a-f]{40}|[0-9a-f]{64}) /);
    if (firstEntry) creation = commit(firstEntry[2]);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (creation && explicit && explicit !== creation) throw new Error(`Before must match the original worktree revision ${creation.slice(0, 9)}`);
  const before = creation || explicit;
  if (!before) throw new Error('Original worktree revision is unavailable. Supply --before with the known original revision; the previous commit is never used as a fallback.');
  const baseline = {
    version: 1, before,
    source: creation ? 'worktree-creation-reflog' : 'explicit-original-revision',
    pinnedAt: new Date().toISOString(),
  };
  try { await writeFile(metadataPath, `${JSON.stringify(baseline, null, 2)}\n`, { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    return resolveWorktreeBaseline(repo, explicitRef);
  }
  return baseline;
}

const help = `Usage: node worktree-baseline.mjs [--repo PATH] [--before ORIGINAL_REF]

Pin and print the worktree's original Git revision as JSON.

  --repo PATH           Worktree directory; defaults to the current directory.
  --before ORIGINAL_REF Known original revision when the creation record is gone.
  --help                Print this help without creating a baseline pin.

The pin is stored in ui-review-baseline.json inside this worktree's Git directory.
An explicit revision must match any existing pin or available creation record.
The previous commit is never used as a fallback. This records a commit only;
uncommitted original source needs a separate snapshot before editing.
`;

async function main(args) {
  if (args.includes('--help')) {
    process.stdout.write(help);
    return;
  }
  let repo = process.cwd();
  let before;
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option !== '--repo' && option !== '--before') throw new Error(`Unknown option: ${option}. Use --help for usage.`);
    const value = args[++index];
    if (!value || value.startsWith('--')) throw new Error(`${option} requires a value. Use --help for usage.`);
    if (option === '--repo') repo = path.resolve(value);
    else before = value;
  }
  const baseline = await resolveWorktreeBaseline(repo, before);
  process.stdout.write(`${JSON.stringify(baseline, null, 2)}\n`);
}

// Resolve the invoked filename so running the CLI through a symlink also works.
const invokedFile = process.argv[1] ? await realpath(process.argv[1]).catch(() => undefined) : undefined;
if (invokedFile === fileURLToPath(import.meta.url)) {
  try { await main(process.argv.slice(2)); }
  catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
