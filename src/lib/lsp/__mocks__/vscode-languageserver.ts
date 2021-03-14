const config = {
  initializationOptions: {
    filetypes: {
      'typescript': 'eslint',
      'javascript': 'eslint',
    },
  }
}

const onInitialize = (callback: any) => {
  setTimeout(() => callback(config), 20)
};

export const createConnection = () => {
  return connection;
}

export const connection = {
  onInitialize,
};

export enum TextDocumentSyncKind {
  Incremental
}

const textDocuments = {
  onDidChangeContent: jest.fn(),
  onDidSave: jest.fn(),
  listen: jest.fn(),
}

export class TextDocuments {
  constructor() {
    return textDocuments;
  }
}
