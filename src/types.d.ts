import { Transports } from "winston";

/** @hidden */
export type ConsoleCmdTypes = "error" | "warn" | "info" | "log";

export interface ConsoleOptions {
  level?: string;
}

/** @hidden */
export interface ConsoleProxyArgs {
  level: string;
  levels: { [key: string]: number };
}

export interface LoggerArgs {
  consoleOptions?: ConsoleOptions;
  newInstance?: boolean;
  winstonOptions?: WinstonOptions;
}

/** @hidden */
export interface ObjectMap {
  [key: string]: any;
}

export interface WinstonOptions {
  exitOnError?: boolean;
  level?: string;
  levels?: { [key: string]: number };
  transports?: WinstonTransportOptions;
}

export interface WinstonTransportOptions {
  File?: FileTransportInstance;
  Console?: ConsoleTransportInstance;
  Loggly?: WinstonModuleTrasportInstance;
  DailyRotateFile?: DailyRotateFileTransportInstance;
  Http?: HttpTransportInstance;
  Memory?: MemoryTransportInstance;
  Webhook?: WebhookTransportInstance;
  [key: string]: TransportInstance;
}

/** @hidden */
export type WinstonTransportTypes = "File" | "Console" | "Loggly" | "DailyRotateFile" | "Http" | "Memory" | "Webhook";
