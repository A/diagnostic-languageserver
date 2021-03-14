import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument'
import logger, { LogLevel } from './lib/logger';
import LSP from './lib/lsp';
import { appendFileSync } from 'fs';
import processor from './lib/processor';

// TODO: event emiter generics ??

interface AppConfig {
  logLevel: number;
}

const DEFAULT_CONFIG: AppConfig = {
  logLevel: LogLevel.warn,
}

class App {
  private config: AppConfig;
  private lsp: LSP;
  
  constructor(config?: Partial<AppConfig>) {
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    logger.configure({ logLevel: LogLevel.log });
    this.lsp = new LSP();
    this.lsp
      .on('connected', (connection, params) => {
        logger.onMessage((event) => {
          appendFileSync('/home/a8ka/diagnostics.log', event.message + '\n\r');
          connection.console[event.type](event.message);
        });
        logger.log('setup processor');
        processor.setup({
          linters: [{
            filetype: 'javascript',
            command: 'eslint',
            rootPatterns: [
              '.eslintrc',
              '.eslintrc.js',
              '.eslintrs.json',
              'package.json'
            ],
          }]
        });
      })
      .on('document-update', async (event: TextDocumentChangeEvent<TextDocument>) => {
        const { document } = event;
        logger.log('DOC:' + JSON.stringify(document));
        const result = await processor.lint(document);
        logger.log(JSON.stringify(result));
      })
  }
}

export default App;
