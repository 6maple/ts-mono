import { PLUGIN_DISPLAY_NAME } from './host-utils/constant';
import { logger } from './logger';
import { disposeFormatters, setupFormatter } from './plugin-formatter';
import type { ExtensionContext } from './vscode';

export const activate = (context: ExtensionContext) => {
  logger.trySetup();
  logger.logMsg(`${PLUGIN_DISPLAY_NAME} activate`);
  setupFormatter(context);
};

export const deactivate = () => {
  logger.dispose();
  disposeFormatters();
};
