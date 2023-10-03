import * as vscode from '../vscode';
import type { VscodeLogger } from './logging';

export type FormatHandler = (value: string, file: string) => Promise<string>;

export const registerCMDFormatter = (
  selector: vscode.DocumentSelector,
  format: FormatHandler,
  logger: VscodeLogger,
) => {
  const provider = createDocumentCMDFormattingEditProvider(format, logger);
  return registerFormatter(selector, provider);
};

export const registerFormatter = (
  selector: vscode.DocumentSelector,
  provider: vscode.DocumentFormattingEditProvider,
) => {
  return vscode.languages.registerDocumentFormattingEditProvider(
    selector,
    provider,
  );
};

export const createDocumentCMDFormattingEditProvider = (
  format: FormatHandler,
  logger: VscodeLogger,
) => {
  const res: vscode.DocumentFormattingEditProvider = {
    async provideDocumentFormattingEdits(document) {
      const edits: vscode.TextEdit[] = [];
      const endLine = document.lineCount - 1;
      const endCharacter = document.lineAt(endLine).text.length;
      const range = new vscode.Range(0, 0, endLine, endCharacter);
      let result = '';
      try {
        result = await format(document.getText(), document.fileName);
      } catch (error) {
        logger.logMsg('format error', { title: 'format', level: 'ERROR' });
        logger.logMsg(error, { title: 'format', level: 'ERROR' });
      }
      if (result) {
        edits.push(vscode.TextEdit.replace(range, result));
      }

      return edits;
    },
  };
  return res;
};
