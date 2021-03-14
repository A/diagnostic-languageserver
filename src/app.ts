import logger, { LogLevel } from './lib/logger';
import LSP from './lib/lsp';

// TODO: event emiter generics ??
import { TextDocumentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument'

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
    console.log(123123)
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    logger.configure({ logLevel: this.config.logLevel });
    this.lsp = new LSP();
    this.lsp.on('document-update', (event: TextDocumentChangeEvent<TextDocument>) => {
      const { document } = event;
      logger.error('WTFWTF');
      logger.error(JSON.stringify(Object.keys(event)));
      logger.error(JSON.stringify(document));

    });
    this.lsp.on('connect', (connection) => {
      logger.onMessage((event) => {
        connection.console[event.type](event.message);
      });
    })
  }
}

export default App;
