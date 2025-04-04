import { exec } from 'node:child_process';
import path from 'node:path';

export function loadFramework(framework: string) {
  const args = ['bun', `${framework}.ts`].join(' ');

  const childProcess = exec(args, {
    cwd: path.resolve(__dirname, '../frameworks'),
  });

  childProcess.unref();

  return childProcess;
}
