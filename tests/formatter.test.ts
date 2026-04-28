import { describe, it, expect } from 'vitest';
import { filterUserFacing, groupByType, formatForWhatsNew } from '../src/core/formatter';
import type { Commit } from '../src/core/types';

function makeCommit(type: string, message: string, scope?: string): Commit {
  return { hash: 'abc1234', type, scope, message, date: '2025-01-01' };
}

describe('filterUserFacing', () => {
  it('keeps feat, fix, perf, refactor', () => {
    const commits = [
      makeCommit('feat', 'add dark mode'),
      makeCommit('fix', 'fix crash'),
      makeCommit('perf', 'optimize loading'),
      makeCommit('refactor', 'clean up code'),
    ];
    expect(filterUserFacing(commits)).toHaveLength(4);
  });

  it('removes chore, ci, test, docs, build, style', () => {
    const commits = [
      makeCommit('chore', 'bump deps'),
      makeCommit('ci', 'fix pipeline'),
      makeCommit('test', 'add tests'),
      makeCommit('docs', 'update readme'),
      makeCommit('build', 'update esbuild'),
      makeCommit('style', 'format code'),
    ];
    expect(filterUserFacing(commits)).toHaveLength(0);
  });

  it('keeps mixed commits correctly', () => {
    const commits = [
      makeCommit('feat', 'new feature'),
      makeCommit('chore', 'cleanup'),
      makeCommit('fix', 'bug fix'),
      makeCommit('test', 'add test'),
    ];
    const result = filterUserFacing(commits);
    expect(result).toHaveLength(2);
    expect(result[0].message).toBe('new feature');
    expect(result[1].message).toBe('bug fix');
  });
});

describe('groupByType', () => {
  it('groups commits correctly', () => {
    const commits = [
      makeCommit('feat', 'add feature A'),
      makeCommit('feat', 'add feature B'),
      makeCommit('fix', 'fix bug'),
      makeCommit('perf', 'speed up'),
      makeCommit('refactor', 'clean up'),
      makeCommit('other', 'misc change'),
    ];
    const grouped = groupByType(commits);
    expect(grouped.features).toHaveLength(2);
    expect(grouped.fixes).toHaveLength(1);
    expect(grouped.improvements).toHaveLength(2);
    expect(grouped.other).toHaveLength(1);
  });

  it('handles empty input', () => {
    const grouped = groupByType([]);
    expect(grouped.features).toHaveLength(0);
    expect(grouped.fixes).toHaveLength(0);
    expect(grouped.improvements).toHaveLength(0);
    expect(grouped.other).toHaveLength(0);
  });
});

describe('formatForWhatsNew', () => {
  it('formats features and fixes', () => {
    const grouped = groupByType([
      makeCommit('feat', 'add dark mode'),
      makeCommit('fix', 'fix crash on startup'),
    ]);
    const text = formatForWhatsNew(grouped);
    expect(text).toContain('New Features:');
    expect(text).toContain('• add dark mode');
    expect(text).toContain('Bug Fixes:');
    expect(text).toContain('• fix crash on startup');
  });

  it('omits empty sections', () => {
    const grouped = groupByType([makeCommit('fix', 'fix bug')]);
    const text = formatForWhatsNew(grouped);
    expect(text).not.toContain('New Features:');
    expect(text).toContain('Bug Fixes:');
  });

  it('includes other commits when no categorized ones exist', () => {
    const grouped = groupByType([makeCommit('other', 'misc update')]);
    const text = formatForWhatsNew(grouped);
    expect(text).toContain('Changes:');
    expect(text).toContain('• misc update');
  });

  it('omits other commits when categorized ones exist', () => {
    const grouped = groupByType([
      makeCommit('feat', 'new feature'),
      makeCommit('other', 'misc update'),
    ]);
    const text = formatForWhatsNew(grouped);
    expect(text).toContain('New Features:');
    expect(text).not.toContain('Changes:');
  });

  it('handles improvements', () => {
    const grouped = groupByType([makeCommit('perf', 'faster loading')]);
    const text = formatForWhatsNew(grouped);
    expect(text).toContain('Improvements:');
    expect(text).toContain('• faster loading');
  });
});
