import type { Commit, GroupedCommits } from './types';
import { INTERNAL_TYPES, TYPE_LABELS } from './types';

/**
 * Filter commits to only user-facing changes.
 * Removes known internal types but keeps "other" (non-conventional commits).
 */
export function filterUserFacing(commits: Commit[]): Commit[] {
  return commits.filter((c) => !INTERNAL_TYPES.includes(c.type));
}

/**
 * Group commits by type category.
 */
export function groupByType(commits: Commit[]): GroupedCommits {
  const groups: GroupedCommits = {
    features: [],
    fixes: [],
    improvements: [],
    other: [],
  };

  for (const commit of commits) {
    switch (commit.type) {
      case 'feat':
        groups.features.push(commit);
        break;
      case 'fix':
        groups.fixes.push(commit);
        break;
      case 'perf':
      case 'refactor':
        groups.improvements.push(commit);
        break;
      default:
        groups.other.push(commit);
        break;
    }
  }

  return groups;
}

/**
 * Format grouped commits into a What's New text (English).
 */
export function formatForWhatsNew(grouped: GroupedCommits): string {
  const lines: string[] = [];

  if (grouped.features.length > 0) {
    lines.push('New Features:');
    for (const c of grouped.features) {
      lines.push(`• ${c.message}`);
    }
    lines.push('');
  }

  if (grouped.fixes.length > 0) {
    lines.push('Bug Fixes:');
    for (const c of grouped.fixes) {
      lines.push(`• ${c.message}`);
    }
    lines.push('');
  }

  if (grouped.improvements.length > 0) {
    lines.push('Improvements:');
    for (const c of grouped.improvements) {
      lines.push(`• ${c.message}`);
    }
    lines.push('');
  }

  // Include "other" commits if no categorized commits exist
  if (lines.length === 0 && grouped.other.length > 0) {
    lines.push('Changes:');
    for (const c of grouped.other) {
      lines.push(`• ${c.message}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

/**
 * Format commits for pretty terminal display.
 */
export function formatPretty(grouped: GroupedCommits): string {
  const lines: string[] = [];

  const sections: [string, Commit[]][] = [
    ['🎉 New Features', grouped.features],
    ['🛠️ Bug Fixes', grouped.fixes],
    ['⚡ Improvements', grouped.improvements],
    ['📦 Other', grouped.other],
  ];

  for (const [title, commits] of sections) {
    if (commits.length === 0) continue;
    lines.push(`\n${title}`);
    for (const c of commits) {
      const scope = c.scope ? `(${c.scope}) ` : '';
      lines.push(`  ${c.hash.slice(0, 7)} ${scope}${c.message}`);
    }
  }

  return lines.join('\n');
}
