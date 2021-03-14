import { Command } from 'commander';
import App from './app';

const options = new Command("diagnostic-languageserver")
  .version(require("../package.json").version)
  .option("--log-level <logLevel>", "A number indicating the log level (4 = log, 3 = info, 2 = warn, 1 = error). Defaults to `2`.")
  // vscode-languageserver params
  .option("--stdio", "use stdio")
  .option("--node-ipc", "use node-ipc")
  .option("--socket <port>", "use socket. example: --socket=5000")

  .parse(process.argv);

new App({
  logLevel: options.logLevel
});
