import { execSync } from 'child_process';
import type { Commit } from './types';

const COMMIT_SEPARATOR = '---COMMIT---';
const FIELD_SEPARATOR = '---FIELD---';

/**
 * Parse git log output into structured Commit objects.
 */
export function getCommitsSince(ref?: string, cwd?: string): Commit[] {
  const range = ref ? `${ref}..HEAD` : '';
  const format = `${COMMIT_SEPARATOR}%H${FIELD_SEPARATOR}%s${FIELD_SEPARATOR}%b${FIELD_SEPARATOR}%ai`;

  let cmd = `git log ${range} --format="${format}"`;
  if (!range) {
    // No ref specified, get commits since last tag or last 50
    const tag = getLatestTag(cwd);
    if (tag) {
      cmd = `git log ${tag}..HEAD --format="${format}"`;
    } else {
      cmd = `git log -50 --format="${format}"`;
    }
  }

  let output: string;
  try {
    output = execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return [];
  }

  if (!output) return [];

  return output
    .split(COMMIT_SEPARATOR)
    .filter(Boolean)
    .map((block) => {
      const [hash, subject, body, date] = block.split(FIELD_SEPARATOR).map((s) => s.trim());
      const parsed = parseConventionalCommit(subject || '');
      return {
        hash: hash || '',
        type: parsed.type,
        scope: parsed.scope,
        message: parsed.message,
        body: body || undefined,
        date: date || '',
      };
    });
}

/**
 * Get the latest semver tag in the repo.
 */
export function getLatestTag(cwd?: string): string | null {
  try {
    const tag = execSync('git describe --tags --abbrev=0 HEAD 2>/dev/null', {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return tag || null;
  } catch {
    return null;
  }
}

/**
 * Parse a conventional commit subject line.
 * e.g., "feat(auth): add login" → { type: "feat", scope: "auth", message: "add login" }
 */
export function parseConventionalCommit(subject: string): {
  type: string;
  scope?: string;
  message: string;
} {
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?!?:\s*(.+)$/);
  if (match) {
    return {
      type: match[1],
      scope: match[2] || undefined,
      message: match[3],
    };
  }
  return { type: 'other', message: subject };
}
