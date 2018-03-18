import { LoggerInstance, TransportInstance, Winston } from "winston";
import ConsoleProxy from "../console-proxy";

import {
  ConsoleOptions,
  LoggerArgs,
  ObjectMap,
  WinstonOptions,
  WinstonTransportOptions,
  WinstonTransportTypes,
} from "../types";

let instance: Logger;

/**
 * An isomorphic logger that uses Winston on
 * the server and console on the client.
 *
 */
export class Logger {
  private static _levels = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 };

  private _client: ConsoleProxy | LoggerInstance;

  private _defaultConsoleOptions = {
    level: "info",
    levels: Logger._levels,
  };

  private _defaultWinstonOptions: WinstonOptions = {
    exitOnError: false,
    level: "info",
    levels: Logger._levels,
    transports: {
      Console: {
        colorize: true,
        handleExceptions: true,
        json: true,
        timestamp: () => new Date().toISOString(),
      },
    },
  };

  constructor(args: LoggerArgs = {}) {
    const { consoleOptions, newInstance = false, winstonOptions } = args;
    if (instance && !newInstance) return instance;

    if (process.env.WEB_ENV) {
      const ConsolePrxy = require("../console-proxy").default;
      this._client = this._initializeConsole(ConsolePrxy, consoleOptions);
    } else {
      const winston = require("winston");
      this._client = this._initializeWinston(winston, winstonOptions);
    }

    instance = this;
    return instance;
  }

  get client(): ConsoleProxy | LoggerInstance {
    return this._client;
  }

  public debug(message: string, meta?: any): void {
    this._log("debug", message, meta);
  }

  public error(message: string, meta?: any): void {
    this._log("error", message, meta);
  }

  public info(message: string, meta?: any): void {
    this._log("info", message, meta);
  }

  public verbose(message: string, meta?: any): void {
    this._log("verbose", message, meta);
  }

  public warn(message: string, meta?: any): void {
    this._log("warn", message, meta);
  }

  private _initializeConsole(ConsolePrxy: ConsoleProxy, options: ConsoleOptions = {}): ConsoleProxy {
    return new ConsoleProxy({ ...this._defaultConsoleOptions, ...options });
  }

  private _initializeWinston(winston: Winston, options: WinstonOptions = {}): LoggerInstance {
    const mergedOptions = this._mergeWinstonOptions(winston, options);
    const transports: TransportInstance[] = [];

    if (mergedOptions.transports) {
      const mergedOptionsTransports = mergedOptions.transports as WinstonTransportOptions;

      Object.keys(mergedOptionsTransports).map((key: WinstonTransportTypes) => {
        const WinstonTransport = winston.transports[key] as TransportInstance;

        transports.push(new WinstonTransport(mergedOptionsTransports[key]));
      });
    }

    return new winston.Logger({ ...mergedOptions, ...{ transports } });
  }

  private _log(level: string, message: string, meta?: ObjectMap): void {
    if (process.env.ISO_LOG === "false") return;
    this._client.log(level, message, meta);
  }

  private _mergeWinstonOptions(winston: Winston, options: WinstonOptions): WinstonOptions {
    if (options.transports) {
      const transportOptions = options.transports as WinstonTransportOptions;
      const validOptions: WinstonTransportOptions = {};

      Object.keys(transportOptions).forEach((key) => {
        if (key in winston.transports) {
          validOptions[key] = transportOptions[key];
        }
      });

      options.transports = validOptions;
    }

    return { ...this._defaultWinstonOptions, ...options };
  }
}
