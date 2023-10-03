import { execaCommand } from 'execa';
import { formatStr } from '@zyi/toolkit';
import * as vscode from './vscode';

import { getConfigKey, getVscodePluginConfig } from './host-utils/config';
import { registerCMDFormatter } from './host-utils/formatter';
import { logger } from './logger';
import type { FormatHandler } from './host-utils/formatter';

const disposableList: vscode.Disposable[] = [];
const formatterList: vscode.Disposable[] = [];

export const setupFormatter = (context: vscode.ExtensionContext) => {
  const instance = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(getConfigKey('formatters'))) {
      updateFormatters();
    }
  });
  context.subscriptions.push(instance);
  updateFormatters();
};

export const disposeFormatters = () => {
  logger.logMsgList([`dispose ${formatterList.length} formatters.`]);
  for (const formatter of formatterList) {
    formatter.dispose();
  }
  formatterList.splice(0, formatterList.length);
  for (const disposable of disposableList) {
    disposable.dispose();
  }
  disposableList.splice(0, disposableList.length);
};

const updateFormatters = () => {
  logger.logMsgList(['dispose all formatters before update formatters.']);
  disposeFormatters();
  const config = getVscodePluginConfig();
  logger.logMsgList(['update formatters. The config is:', config]);
  const { formatters = [] } = config;
  if (formatters.length === 0) {
    return;
  }
  for (const item of formatters) {
    const { selectors, command } = item;
    const instance = registerCMDFormatter(
      selectors,
      createFormatHandler(command),
      logger,
    );
    formatterList.push(instance);
  }
};

const createFormatHandler = (command: string): FormatHandler => {
  return async (value, file) => {
    const normalizedCommand = formatStr(command, { file, content: value });
    logger.logMsgList([
      `raw command: ${command}`,
      `normalized command: ${normalizedCommand}`,
    ]);
    try {
      const res = await execaCommand(normalizedCommand);
      return res.stdout;
    } catch (error) {
      logger.logMsgList([normalizedCommand, error], {
        title: 'execute command error',
        level: 'ERROR',
      });
      return value;
    }
  };
};
