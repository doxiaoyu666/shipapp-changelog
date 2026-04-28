import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { getCommitsSince, getLatestTag } from '../core/git';
import { filterUserFacing, groupByType, formatForWhatsNew, formatPretty } from '../core/formatter';

const server = new McpServer({
  name: 'shipapp-changelog',
  version: '0.1.0',
});

server.tool(
  'changelog_log',
  'Show git commit history grouped by type',
  {
    cwd: z.string().optional().describe('Git repository path'),
    since: z.string().optional().describe('Git ref to start from'),
  },
  async ({ cwd, since }) => {
    const commits = getCommitsSince(since, cwd || '.');
    if (commits.length === 0) {
      return { content: [{ type: 'text', text: 'No commits found.' }] };
    }

    const userFacing = filterUserFacing(commits);
    const grouped = groupByType(userFacing);
    const tag = since || getLatestTag(cwd || '.');

    const summary = `${commits.length} commits${tag ? ` since ${tag}` : ''} (${userFacing.length} user-facing)`;
    const pretty = formatPretty(grouped);

    return { content: [{ type: 'text', text: `${summary}\n${pretty}` }] };
  }
);

server.tool(
  'changelog_generate',
  "Generate What's New text from git commits",
  {
    cwd: z.string().optional().describe('Git repository path'),
    since: z.string().optional().describe('Git ref to start from'),
  },
  async ({ cwd, since }) => {
    const commits = getCommitsSince(since, cwd || '.');
    if (commits.length === 0) {
      return { content: [{ type: 'text', text: 'No commits found.' }] };
    }

    const userFacing = filterUserFacing(commits);
    const grouped = groupByType(userFacing);
    const whatsNew = userFacing.length > 0
      ? formatForWhatsNew(grouped)
      : 'Performance improvements and bug fixes.';

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          total_commits: commits.length,
          user_facing: userFacing.length,
          whats_new_en: whatsNew,
          commits: userFacing.map((c) => ({
            type: c.type,
            scope: c.scope,
            message: c.message,
          })),
        }, null, 2),
      }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
