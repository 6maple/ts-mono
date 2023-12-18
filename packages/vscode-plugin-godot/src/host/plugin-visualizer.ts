import fs from 'node:fs/promises';
import { EVENT_TYPE } from '../shared/constant';
import * as vscode from './vscode';
import { logger } from './logger';
import { getConfigKey, getVscodePluginConfig } from './host-utils/config';
import { PLUGIN_NAME } from './host-utils/constant';
import { resolveClassListByDir } from './host-utils/gd-resolver';
import type {
  EventDataClassData,
  EventDataRefresh,
  VscodePluginConfig,
} from '../shared/constant';

let panel: vscode.WebviewPanel | undefined;
const disposableList: vscode.Disposable[] = [];

export const setupVisualizer = (context: vscode.ExtensionContext) => {
  logger.logMsg(`command ${PLUGIN_NAME}.visualizer.start`);
  const commandDisposable = vscode.commands.registerCommand(
    `${PLUGIN_NAME}.visualizer.start`,
    () => {
      const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
      if (panel) {
        panel.reveal(columnToShowIn);
        return;
      }
      panel = vscode.window.createWebviewPanel(
        `${PLUGIN_NAME.toLowerCase()} visualizer`,
        `${PLUGIN_NAME} Visualizer`,
        columnToShowIn || vscode.ViewColumn.One,
        { enableScripts: true },
      );
      setupPanelHTML(panel, context);
      panel.webview.onDidReceiveMessage(
        (event) => {
          handleWebviewMessage(panel, event);
        },
        null,
        disposableList,
      );
      panel.onDidDispose(
        () => {
          disposeRecords();
          panel = undefined;
        },
        null,
        context.subscriptions,
      );
    },
  );
  context.subscriptions.push(commandDisposable);

  const configDisposable = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (!event.affectsConfiguration(getConfigKey('visualizer'))) {
        return;
      }
      if (panel) {
        updateVisualizer(panel);
      }
    },
  );
  context.subscriptions.push(configDisposable);
};

export const disposeVisualizer = () => {
  disposeRecords();
};

const disposeRecords = () => {
  for (const item of disposableList) {
    item.dispose();
  }
  disposableList.splice(0, disposableList.length);
};

const setupPanelHTML = async (
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
) => {
  const htmlPath = context.asAbsolutePath('dist-client/visualizer/index.html');
  const webRoot = panel.webview.asWebviewUri(
    vscode.Uri.file(context.asAbsolutePath('dist-client')),
  );
  let html = await fs.readFile(htmlPath, { encoding: 'utf8' });
  html = html.replace(/VSCODE_WEB_ROOT/g, webRoot.toString());
  logger.logMsg(html);
  panel.webview.html = html;
};

const updateVisualizer = (panel: vscode.WebviewPanel) => {
  sendClassData(panel, '');
};

const handleWebviewMessage = (
  panel: vscode.WebviewPanel | undefined,
  data: any,
) => {
  if (!data || !panel) {
    return;
  }
  logger.logMsgList([`<visualizer> accept message`, JSON.stringify(data)]);
  const { type } = data;
  if (type === EVENT_TYPE.refresh) {
    const { refreshKey } = data as EventDataRefresh;
    logger.logMsgList([`<visualizer> accept refresh`]);
    sendClassData(panel, refreshKey);
  }
};

const sendClassData = async (panel: vscode.WebviewPanel, refreshKey = '') => {
  logger.logMsgList([`<visualizer> start resolveClassList`]);
  const config = getVscodePluginConfig();
  const classList = await resolveClassList(config);
  logger.logMsgList([
    `<visualizer> finish resolveClassList`,
    JSON.stringify(classList),
  ]);
  panel.webview.postMessage(<EventDataClassData>{
    type: EVENT_TYPE.classData,
    refreshKey,
    value: {
      title: 'class visualizer',
      classList,
      config,
    },
  });
};

const resolveClassList = async (config: VscodePluginConfig) => {
  const { visualizer } = config;
  const { includePatterns = ['./**/*.gd'] } = visualizer || {};
  if (includePatterns.length === 0) {
    return;
  }
  const workspace = vscode.workspace.workspaceFolders?.[0];
  if (!workspace) {
    return;
  }
  const { fsPath } = workspace.uri;
  logger.logMsgList([`<visualizer> workspace ${fsPath}`]);
  return resolveClassListByDir(fsPath, {
    ...config,
    includePatterns,
  });
};
