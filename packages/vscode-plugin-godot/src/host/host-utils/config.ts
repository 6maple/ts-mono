import * as vscode from '../vscode';
import { PLUGIN_NAME } from './constant';
import type { VscodePluginConfig } from '../../shared/constant';

export const getVscodePluginConfig = (uri?: vscode.Uri): VscodePluginConfig => {
  const config = vscode.workspace.getConfiguration(
    PLUGIN_NAME,
    uri,
  ) as unknown as VscodePluginConfig;
  if (!vscode.workspace.isTrusted) {
    return { formatters: [] };
  }
  return config;
};

export const getConfigKey = (key: string) => {
  return `${PLUGIN_NAME}.${key}`;
};
