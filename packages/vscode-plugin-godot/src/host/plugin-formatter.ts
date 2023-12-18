import { execa } from 'execa';
import { formatStr } from '@zyi/toolkit-core';
import * as vscode from './vscode';

import { getConfigKey, getVscodePluginConfig } from './host-utils/config';
import { registerCMDFormatter } from './host-utils/formatter';
import { logger } from './logger';
import type { VscodePluginConfig } from './host-utils/config';
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
    const { selectors, commands } = item;
    if (!checkIsValidArray(selectors) || !checkIsValidArray(commands)) {
      continue;
    }
    for (const selectorItem of selectors!) {
      const instance = registerCMDFormatter(
        selectorItem,
        createFormatHandler(item),
        logger,
      );
      formatterList.push(instance);
    }
  }
};

const checkIsValidArray = (value: unknown) => {
  return Array.isArray(value) && value.length > 0;
};

const createFormatHandler = (
  config: Required<VscodePluginConfig>['formatters'][0],
): FormatHandler => {
  const { commands, stdoutAsResult } = config;
  return async (value, file) => {
    const ctx = { file, content: value };
    const normalizedCommands = commands!.map((item) => formatStr(item, ctx));
    const [cmd, ...cmdArgs] = normalizedCommands;
    logger.logMsgList([
      `raw command: ${commands}`,
      `normalized command: ${normalizedCommands}`,
    ]);
    try {
      const res = await execa(cmd, cmdArgs);
      if (stdoutAsResult) {
        return res.stdout;
      }
    } catch (error) {
      logger.logMsgList([normalizedCommands, error], {
        title: 'execute command error',
        level: 'ERROR',
      });
    }
  };
};
