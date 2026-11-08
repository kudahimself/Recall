/**
 * Type-checks TypeScript for the tests of a TypeScript exercise, the way VS Code and
 * `npx tsc` check it, with the settings in tsconfig.json. Leave this file as it is.
 *
 * Vitest runs a .ts file by stripping its types, so a test that runs your code
 * cannot see whether its types are right. fileTypeErrors hands the TypeScript
 * compiler one of your files, and typeErrors a few lines of the test's that use
 * your module, as if they sat in a file next to it; each gives back the compiler's
 * errors, so a test can expect none. In the test's lines, a line after
 * `// @ts-expect-error` must not compile: when it does, that is an error too.
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const config = ts.getParsedCommandLineOfConfigFile(join(here, 'tsconfig.json'), {}, {
  ...ts.sys,
  onUnRecoverableConfigFileDiagnostic: d => { throw new Error(ts.flattenDiagnosticMessageText(d.messageText, '\n')); },
});
const options = { ...config.options, noEmit: true };
// The standard library's declarations, parsed once per test file instead of once per check.
const libFiles = new Map();

/** The compiler's errors for a program rooted at `root`, which may be a file only in memory. */
function diagnose(root, code) {
  const dir = ts.getDirectoryPath(root);
  const host = ts.createCompilerHost(options, true);
  const { getSourceFile, fileExists, readFile } = host;
  if (code !== undefined) {
    host.fileExists = f => f === root || fileExists.call(host, f);
    host.readFile = f => (f === root ? code : readFile.call(host, f));
  }
  host.getSourceFile = (f, lang, onError) => {
    if (f === root && code !== undefined) return ts.createSourceFile(f, code, lang, true);
    if (f.startsWith(dir)) return getSourceFile.call(host, f, lang, onError);
    if (!libFiles.has(f)) libFiles.set(f, getSourceFile.call(host, f, lang, onError));
    return libFiles.get(f);
  };
  const program = ts.createProgram({ rootNames: [root], options, host });
  return ts.getPreEmitDiagnostics(program).map(d => ({
    file: d.file?.fileName,
    line: d.file ? d.file.getLineAndCharacterOfPosition(d.start ?? 0).line : 0,
    text: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
  }));
}

/**
 * The type errors in the file at `fileUrl` (such as new URL('./prices.ts', import.meta.url))
 * and in the files of its folder that it imports, each as "file:line: message";
 * an empty array means they compile.
 */
export function fileTypeErrors(fileUrl) {
  const file = ts.normalizePath(fileURLToPath(fileUrl));
  const dir = ts.getDirectoryPath(file);
  return diagnose(file).map(d => (d.file ? `${d.file.slice(dir.length + 1)}:${d.line + 1}: ${d.text}` : d.text));
}

/**
 * The type errors in `code`, checked as a .ts file in the folder of `testUrl`
 * (pass import.meta.url), so it can import your module. Each error quotes the
 * line it is on; an empty array means the code compiles, and every line after a
 * `// @ts-expect-error` failed to, as it should. Errors inside your own files
 * are fileTypeErrors' to report, not these.
 */
export function typeErrors(code, testUrl) {
  const root = ts.normalizePath(join(dirname(fileURLToPath(testUrl)), '__typecheck__.ts'));
  const lines = code.split('\n');
  return diagnose(root, code)
    .filter(d => d.file === root)
    .map(d => `at \`${lines[d.line].trim()}\`: ${d.text}`);
}
