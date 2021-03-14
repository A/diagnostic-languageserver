import { SpawnOptions, spawn } from 'child_process';
import os from 'os';
import logger from '../logger';

export interface SpawnAsyncOptions extends SpawnOptions {
  input?: Readable
}

export async function spawnAsync(
  command: string,
  args: ReadonlyArray<string>,
  options: SpawnAsyncOptions,
  stdin?: string,
): Promise<{
  code: number,
  stdout: string,
  stderr: string
}> {
  return new Promise((resolve, reject) => {
    try {
      const child = spawn(
        command,
        args,
        { ...options, shell: os.platform() === 'win32' ? true : undefined }
      );
      let stdout = ''
      let stderr = ''
      let error: Error

      child.stdout.on('data', (data) => {
        stdout += data
      });

      child.stderr.on('data', (data) => {
        stderr += data
      });

      child.on('error', (err: Error) => {
        error = err
        reject(error)
      });

      child.on('close', (code) => {
        if (!error) {
          resolve({ code, stdout, stderr })
        }
      });

      if (stdin) {
        child.stdin.write(stdin);
        child.stdin.end();

      }

      // error will occur when cp get error
      if (options.input) {
        options.input.pipe(child.stdin).on('error', () => {})
      }
    } catch (e) {
      logger.error(e)
    }
  });
}
