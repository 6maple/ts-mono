import { PLUGIN_DISPLAY_NAME } from './host-utils/constant';
import { logger } from './logger';
import { disposeFormatters, setupFormatter } from './plugin-formatter';
import { disposeVisualizer, setupVisualizer } from './plugin-visualizer';
import type { ExtensionContext } from './vscode';

export const activate = (context: ExtensionContext) => {
  logger.trySetup();
  logger.logMsg(`${PLUGIN_DISPLAY_NAME} activate`);
  setupFormatter(context);
  setupVisualizer(context);
};

export const deactivate = () => {
  disposeFormatters();
  disposeVisualizer();
  logger.dispose();
};
