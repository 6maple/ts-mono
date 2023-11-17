import * as vscode from '../vscode';
import { PLUGIN_DISPLAY_NAME } from './constant';
import type { OutputChannel } from '../vscode';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';
// TODO log level visible control
export const createVscodeLogger = () => {
  const { getLogLevel, setLogLevel } = makeLoggerLevel();
  const { getOutputChannel, trySetup, dispose } = makeLoggerOutputChannel();
  const { logMsg, logMsgList } = makeLoggerLog(getOutputChannel, getLogLevel);
  return {
    getLogLevel,
    setLogLevel,
    getOutputChannel,
    trySetup,
    dispose,
    logMsg,
    logMsgList,
  };
};

export type VscodeLogger = ReturnType<typeof createVscodeLogger>;

const makeLoggerLevel = () => {
  let level: LogLevel = 'INFO';
  const setLogLevel = (value: LogLevel) => {
    level = value;
  };
  const getLogLevel = () => {
    return level;
  };
  return {
    getLogLevel,
    setLogLevel,
  };
};
const makeLoggerOutputChannel = () => {
  let outputChannel: OutputChannel | null = null;
  const getOutputChannel = () => outputChannel;
  const trySetup = () => {
    if (outputChannel) {
      return;
    }
    outputChannel = vscode.window.createOutputChannel(PLUGIN_DISPLAY_NAME);
  };
  const dispose = () => {
    outputChannel?.dispose();
    outputChannel = null;
  };
  return {
    getOutputChannel,
    trySetup,
    dispose,
  };
};
export type LogMsgType = string | object | unknown;
export interface LogMsgOptions {
  title?: string;
  level?: LogLevel;
}
const makeLoggerLog = (
  getOutputChannel: () => OutputChannel | null,
  getLoggerLevel: () => LogLevel,
) => {
  const parseLogMsg = (msg: LogMsgType) => {
    if (typeof msg !== 'object') {
      return msg;
    }
    if (msg instanceof Error) {
      const { name, message, stack } = msg;
      return [name && `#name#${name}#`, message, stack]
        .filter(Boolean)
        .join('\n');
    }
    return JSON.stringify(msg, null, 2);
  };
  const logMsg = (message: LogMsgType, options: LogMsgOptions = {}) => {
    const { title = '*', level = getLoggerLevel() } = options;
    const time = new Date().toLocaleTimeString();
    const msgStr = parseLogMsg(message);
    getOutputChannel()?.appendLine(`[${title}]<${level}>(${time})${msgStr}`);
  };
  const logMsgList = (messages: LogMsgType[], options: LogMsgOptions = {}) => {
    for (const msg of messages) {
      logMsg(msg, options);
    }
  };
  return {
    logMsg,
    logMsgList,
  };
};
