import { describe, it, expect } from 'vitest';
import { parseConventionalCommit } from '../src/core/git';

describe('parseConventionalCommit', () => {
  it('parses feat with scope', () => {
    const result = parseConventionalCommit('feat(auth): add login flow');
    expect(result).toEqual({ type: 'feat', scope: 'auth', message: 'add login flow' });
  });

  it('parses fix without scope', () => {
    const result = parseConventionalCommit('fix: resolve crash on launch');
    expect(result).toEqual({ type: 'fix', scope: undefined, message: 'resolve crash on launch' });
  });

  it('parses breaking change', () => {
    const result = parseConventionalCommit('feat!: redesign settings page');
    expect(result).toEqual({ type: 'feat', scope: undefined, message: 'redesign settings page' });
  });

  it('parses breaking change with scope', () => {
    const result = parseConventionalCommit('feat(api)!: change response format');
    expect(result).toEqual({ type: 'feat', scope: 'api', message: 'change response format' });
  });

  it('handles non-conventional commit', () => {
    const result = parseConventionalCommit('Update README');
    expect(result).toEqual({ type: 'other', message: 'Update README' });
  });

  it('handles chore type', () => {
    const result = parseConventionalCommit('chore: bump dependencies');
    expect(result).toEqual({ type: 'chore', scope: undefined, message: 'bump dependencies' });
  });

  it('handles docs type with scope', () => {
    const result = parseConventionalCommit('docs(readme): add installation guide');
    expect(result).toEqual({ type: 'docs', scope: 'readme', message: 'add installation guide' });
  });
});
