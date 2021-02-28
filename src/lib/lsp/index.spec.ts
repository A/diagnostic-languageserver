import LSP from '.';
import { TextDocuments } from 'vscode-languageserver';
import { flatten } from 'lodash';

const CHANGE_EVENT = { type: 'change' };
const SAVE_EVENT = { type: 'save' };

describe('LSP', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })

  it('should initialize connection', (done) => {
    const lsp = new LSP();
    lsp.on('init', (params) => {
      expect(params).toEqual({});
      done();
    });
  });

  it('should attach document listenters', async () => {
    const lsp = new LSP();
    await wait(40);
    const td = new TextDocuments(null); // mocked as singleton
    expect(td.onDidSave).toBeCalledTimes(1);
    expect(td.onDidChangeContent).toBeCalledTimes(1);
    // @ts-ignore
    expect(td.listen).toBeCalledWith(lsp.connection);
  });

  describe('handle document events', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      const td = new TextDocuments(null); // mocked as singleton

      // @ts-ignore
      td.onDidChangeContent = jest.fn((cb: any) => {
        setTimeout(() => cb(CHANGE_EVENT), 100)
      });

      // @ts-ignore
      td.onDidSave = jest.fn((cb: any) => {
        setTimeout(() => cb(SAVE_EVENT), 100)
      });

    });

    it('should emit updates from onDidChangeContent', async () => { const event = { type: 'change' };
      // create LSP layer
      const lsp = new LSP();
      await wait(30); // wait till initialized (20ms)
    
      // check if handler is called
      const handler = jest.fn();
      lsp.on('document-update', handler);
      await wait(150);
      expect(handler).toBeCalledWith(CHANGE_EVENT);
    });

    it('should emit updates from onDidSaveContent', async () => {
      // create LSP layer
      const lsp = new LSP();
      await wait(30);
    
      // check if handler is called
      const handler = jest.fn();
      lsp.on('document-update', handler);
      await wait(100);
      expect(handler).toBeCalledWith(SAVE_EVENT);
    });

    it('should not emit updates from onDidChangeContent if it is not enabled in emitOnEvents', async () => {
      // create LSP layer
      const lsp = new LSP({
        emitOnEvents: ['save'],
      });
      await wait(30); // wait till initialized (20ms)
    
      // check if handler is called
      const handler = jest.fn();
      lsp.on('document-update', handler);
      await wait(150);
      const args = flatten(handler.mock.calls);
      args.forEach(arg => expect(arg).not.toEqual(CHANGE_EVENT));
    });

    it('should not emit updates from onDidSave if it is not enabled in emitOnEvents', async () => {
      // create LSP layer
      const lsp = new LSP({
        emitOnEvents: ['change'],
      });
      await wait(30); // wait till initialized (20ms)
    
      // check if handler is called
      const handler = jest.fn();
      lsp.on('document-update', handler);
      await wait(150);
      const args = flatten(handler.mock.calls);
      args.forEach(arg => expect(arg).not.toEqual(SAVE_EVENT));
    });
  });
});

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

