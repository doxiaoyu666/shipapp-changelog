import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateCommand } from './commands/generate';
import { logCommand } from './commands/log';

yargs(hideBin(process.argv))
  .scriptName('shipapp-changelog')
  .usage('$0 <command> [options]')
  .command(
    'generate',
    'Generate What\'s New from git commits',
    (y) =>
      y
        .option('since', { type: 'string', describe: 'Git ref to start from (tag, commit, date)' })
        .option('output', { type: 'string', default: './whats_new', describe: 'Output directory' })
        .option('cwd', { type: 'string', default: '.', describe: 'Git repository path' }),
    async (argv) => {
      await generateCommand(argv.since, argv.output, argv.cwd);
    }
  )
  .command(
    'log',
    'Show formatted git commit history',
    (y) =>
      y
        .option('since', { type: 'string', describe: 'Git ref to start from' })
        .option('format', { type: 'string', choices: ['pretty', 'json'], default: 'pretty', describe: 'Output format' })
        .option('cwd', { type: 'string', default: '.', describe: 'Git repository path' }),
    async (argv) => {
      await logCommand(argv.since, argv.format, argv.cwd);
    }
  )
  .demandCommand(1, 'Please specify a command')
  .help()
  .parse();
