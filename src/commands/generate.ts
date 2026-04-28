import fs from 'fs';
import path from 'path';
import ora from 'ora';
import { getCommitsSince, getLatestTag } from '../core/git';
import { filterUserFacing, groupByType, formatForWhatsNew } from '../core/formatter';
import type { ChangelogOutput } from '../core/types';

export async function generateCommand(
  since: string | undefined,
  outputDir: string,
  cwd: string
): Promise<void> {
  const spinner = ora('Reading git history...').start();

  const tag = since || getLatestTag(cwd);
  const commits = getCommitsSince(since || undefined, cwd);

  if (commits.length === 0) {
    spinner.fail('No commits found');
    process.exit(1);
  }

  const userFacing = filterUserFacing(commits);
  spinner.text = `Found ${commits.length} commits (${userFacing.length} user-facing)`;

  if (userFacing.length === 0) {
    spinner.warn('No user-facing commits found (all chore/ci/test/docs)');
    // Still generate a generic message
  }

  const grouped = groupByType(userFacing);
  const whatsNew = userFacing.length > 0
    ? formatForWhatsNew(grouped)
    : 'Performance improvements and bug fixes.';

  spinner.stop();

  console.log(`\n📋 ${commits.length} commits${tag ? ` since ${tag}` : ''}\n`);
  console.log(whatsNew);

  // Write en-US JSON
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const output: ChangelogOutput = {
    language_code: 'en-US',
    whats_new: whatsNew,
  };

  const filePath = path.join(outputDir, 'en-US.json');
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n');
  console.log(`\n✅ Written to ${filePath}`);
  console.log('\n💡 Use AI (Claude Code skill /changelog) to generate multilingual versions.');
  console.log('   Then push with: shipapp-metadata push --app <name> --dir <dir> --only whats_new');
}
