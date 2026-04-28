export interface Commit {
  hash: string;
  type: string;
  scope?: string;
  message: string;
  body?: string;
  date: string;
}

export interface GroupedCommits {
  features: Commit[];
  fixes: Commit[];
  improvements: Commit[];
  other: Commit[];
}

export interface ChangelogOutput {
  language_code: string;
  whats_new: string;
}

// Conventional commit types that are user-facing
export const USER_FACING_TYPES = ['feat', 'fix', 'perf', 'refactor'];

// Types to filter out (not user-facing)
export const INTERNAL_TYPES = ['chore', 'ci', 'test', 'docs', 'build', 'style'];

// Type display names
export const TYPE_LABELS: Record<string, string> = {
  feat: 'New Features',
  fix: 'Bug Fixes',
  perf: 'Performance',
  refactor: 'Improvements',
};
