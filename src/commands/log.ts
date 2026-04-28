import { getCommitsSince, getLatestTag } from '../core/git';
import { filterUserFacing, groupByType, formatPretty } from '../core/formatter';

export async function logCommand(
  since: string | undefined,
  format: string,
  cwd: string
): Promise<void> {
  const tag = since || getLatestTag(cwd);
  const commits = getCommitsSince(since || undefined, cwd);

  if (commits.length === 0) {
    console.log('No commits found.');
    return;
  }

  const userFacing = filterUserFacing(commits);
  const grouped = groupByType(userFacing);

  console.log(`📋 ${commits.length} commits${tag ? ` since ${tag}` : ''} (${userFacing.length} user-facing)`);

  if (format === 'json') {
    console.log(JSON.stringify({ total: commits.length, userFacing: userFacing.length, grouped }, null, 2));
  } else {
    console.log(formatPretty(grouped));

    if (commits.length > userFacing.length) {
      const skipped = commits.length - userFacing.length;
      console.log(`\n  (${skipped} internal commits hidden: chore, ci, test, docs)`);
    }
  }
}
