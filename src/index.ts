import { Command } from 'commander';
import {
  createConnection,
  TextDocuments,
  IConnection,
  DocumentFormattingParams,
  CancellationToken,
  TextDocumentChangeEvent,
  TextDocumentSyncKind,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument'

import { IConfig } from './common/types';
import {
  next as diagnosticNext,
  unsubscribe as diagnosticUnsubscribe
} from './handles/handleDiagnostic'
import logger from './lib/logger';
import { formatDocument } from './handles/handleFormat';

// parse command line options
const options = new Command("diagnostic-languageserver")
  .version(require("../package.json").version)
  .option("--log-level <logLevel>", "A number indicating the log level (4 = log, 3 = info, 2 = warn, 1 = error). Defaults to `2`.")
  .parse(process.argv);

// create connection by command argv
const connection: IConnection = createConnection();

if (options.logLevel) {
  logger.configure({ logLevel: Number(options.logLevel) });
}

logger.onMessage((event) => {
  connection.console[event.type](event.message);
});

// sync text document manager
const documents = new TextDocuments(TextDocument)

// config of initializationOptions
let config: IConfig

// lsp initialize
connection.onInitialize((param) => {
  const { initializationOptions = {} } = param

  config = initializationOptions

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      documentFormattingProvider: true
    }
  };
});

const handleDiagnostic = ( change: TextDocumentChangeEvent<TextDocument> ) => {
  const textDocument = change.document
  const { linters = {}, filetypes = {} } = config
  if (!filetypes[textDocument.languageId]) {
    return
  }
  const linter = [].concat(filetypes[textDocument.languageId])
  const configItems = linter.map(l => linters[l]).filter(l => l)
  if (configItems.length === 0) {
    return
  }
  diagnosticNext(textDocument, connection, configItems)
}

// document change or open
documents.onDidChangeContent(handleDiagnostic);

// document will save
documents.onDidSave(handleDiagnostic)

documents.onDidClose((evt) => {
  diagnosticUnsubscribe(evt.document)
})

// listen for document's open/close/change
documents.listen(connection);

// handle format request
connection.onDocumentFormatting(async (
  params: DocumentFormattingParams,
  token: CancellationToken
) => {
  const { textDocument } = params
  if (!textDocument || !textDocument.uri) {
    return
  }
  const doc = documents.get(textDocument.uri)
  if (!doc) {
    return
  }
  const { formatters, formatFiletypes } = config
  if (!formatFiletypes[doc.languageId]) {
    return
  }
  const formatterNames = [].concat(formatFiletypes[doc.languageId])
  const formatterConfigs = formatterNames.map(n => formatters[n]).filter(n => n)
  if (formatterConfigs.length === 0) {
    return
  }
  return formatDocument(formatterConfigs, doc, token)
})

// lsp start
connection.listen();
