import { Transports } from "winston";

export type ConsoleCmdTypes = "error" | "warn" | "info" | "log";

export interface ConsoleOptions {
  level?: string;
}

export interface ConsoleProxyArgs {
  level: string;
  levels: { [key: string]: number };
}

export interface LoggerArgs {
  consoleOptions?: ConsoleOptions;
  newInstance?: boolean;
  winstonOptions?: WinstonOptions;
}

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

export type WinstonTransportTypes = "File" | "Console" | "Loggly" | "DailyRotateFile" | "Http" | "Memory" | "Webhook";
