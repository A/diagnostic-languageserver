import { spawnSync } from 'child_process';
import { dirname } from 'path';
import { TextDocument } from 'vscode-languageserver-textdocument';
import findUp from 'find-up';
import { spawnAsync } from '../utils';
import logger from '../logger';

interface Config {
  linters: LinterConfig[];
}

interface LinterConfig {
  filetype: string;
  command: string;
  rootPatterns: string | string[];
}

export default new class Processor {
  private config: Config = {
    linters: []
  };

  public setup = (config: Config) => {
    this.config = { ...this.config, ...config };
  }

  public lint = async (document: TextDocument) => {
    logger.log('run linter for '+document.uri)
    const { languageId } = document;
    const content = document.getText();
    try {
      const linter = this.getLinter(languageId);
      const rootFile = await findUp(linter.rootPatterns);
      const cwd = dirname(rootFile);
      logger.log('working dir:'+cwd)
      // TODO: async
      const result = await spawnAsync(linter.command, ['--stdin'], {
        cwd
      }, content);
      logger.log(JSON.stringify(result))

      return result;
    } catch (e) {
      logger.error(e)
    }
  }

  private getLinter = (languageId: string) => {
    return this.config.linters.find(linterConfig => linterConfig.filetype === languageId);
  }
  

}

// interface LintersConfig {
//   command: string
//   rootPatterns: string[] | string
//   isStdout?: boolean
//   isStderr?: boolean
//   debounce?: number
//   args?: Array<string|number>
//   sourceName: string
//   formatLines?: number
//   formatPattern: [string, {
//     sourceName?: string
//     sourceNameFilter?: boolean
//     line: number,
//     column: number,
//     endLine?: number,
//     endColumn?: number,
//     message: Array<number|string> | number,
//     security: number
//   }]
//   securities?: ISecurities
//   offsetLine?: number
//   offsetColumn?: number
//   requiredFiles?: string[]
//   parseJson?: {
//     // Dot separated path. If empty, simply use the root.
//     errorsRoot?: string | string[]
//
//     sourceName?: string
//     sourceNameFilter?: boolean
//     line: string
//     column: string
//
//     // If left out, just use line / column
//     endLine?: string
//     endColumn?: string
//
//     // Will be parsed from the error object.
//     message: string
//     security: string
//   },
//
// }
//
