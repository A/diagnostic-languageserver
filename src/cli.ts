import { Command } from 'commander';
import App from './app';

const options = new Command("diagnostic-languageserver")
  .version(require("../package.json").version)
  .option("--log-level <logLevel>", "A number indicating the log level (4 = log, 3 = info, 2 = warn, 1 = error). Defaults to `2`.")
  .parse(process.argv);

new App({
  logLevel: options.logLevel
});
