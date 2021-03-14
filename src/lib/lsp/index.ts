import {
  createConnection,
  TextDocuments,
  InitializeParams,
  InitializeResult,
  TextDocumentChangeEvent,
  IConnection as Connection,
  TextDocumentSyncKind,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument'
import EventEmitter from 'eventemitter3';
import logger from '../logger';
import { IConfig as LSPConfig} from '../../common/types';

interface Config {
  emitOnEvents: Array<'save' | 'change'>
}

type LspEvent = 'connect' | 'connected' | 'document-update';

type Callback = (event: any) => void;

const capabilities = {
  textDocumentSync: TextDocumentSyncKind.Incremental as 2, // TODO: TS WTF??
  documentFormattingProvider: true
};

const DEFAULT_CONFIG = {
  emitOnEvents: ['change', 'save'],
}

class LSP {
  public lspConfig: LSPConfig
  private connection: Connection;
  private documents: TextDocuments<TextDocument>;
  private config: Config;
  private emitter: EventEmitter;

  constructor(config?: Partial<Config>) {
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    this.emitter = new EventEmitter();
    this.emitter.on('connected', (_, params) => {
      this.lspConfig = Object.assign({}, params.initializationOptions)
      logger.log('Initialization Options ${JSON.stringify(this.config)}')
    });
    this
      .initConnection()
      .listenDocumentEvents()
    ;
  }

  private initConnection = () => {
    this.connection = createConnection();
    this.emitter.emit('connect', this.connection)
    this.connection.onInitialize((params) => {
      this.emitter.emit('connected', this.connection, params);
      return { capabilities };
    });

    this.connection.listen();
    return this;
  }

  private listenDocumentEvents = () => {
    this.documents = new TextDocuments(TextDocument)

    // TODO: get rid of duplication
    this.documents.onDidChangeContent((event) => {
      if (!this.config.emitOnEvents.includes('change')) {
        return;
      }
      if (!this.lspConfig?.filetypes?.[event.document.languageId]) {
        return;
      }
      this.emitter.emit('document-update', event);
    });

    this.documents.onDidSave((event) => {
      if (!this.config.emitOnEvents.includes('save')) {
        return;
      }
      if (!this.lspConfig?.filetypes?.[event.document.languageId]) {
        return;
      }
      this.emitter.emit('document-update', event);
    });

    this.documents.listen(this.connection);
    return this;
  }

  public on = (event: LspEvent, callback: Callback) => {
    this.emitter.on(event, callback);
    return this;
  }

  public off = (event: LspEvent, callback: Callback) => {
    this.emitter.off(event, callback);
    return this;
  }
}

export default LSP;
