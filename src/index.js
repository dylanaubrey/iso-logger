let instance;

/**
 *
 * The iso logger
 */
export default class Logger {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {Logger}
   */
  constructor({ consoleOptions, newInstance = false, winstonOptions } = {}) {
    if (instance && !newInstance) {
      return instance;
    }

    if (process.env.WEB_ENV) {
      const ConsoleProxy = require('./console-proxy').default; // eslint-disable-line global-require
      this._client = this._initializeConsole(ConsoleProxy, consoleOptions);
    } else {
      const winston = require('winston'); // eslint-disable-line global-require
      this._client = this._initializeWinston(winston, winstonOptions);
    }

    instance = this;
    return instance;
  }

  /**
   *
   * @static
   * @type {Object}
   */
  static levels = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 };

  /**
   *
   * @private
   * @type {Object}
   */
  _defaultConsoleOptions = {
    level: 'info',
    levels: Logger.levels,
  };

  /**
   *
   * @private
   * @type {Object}
   */
  _defaultWinstonOptions = {
    exitOnError: false,
    level: 'info',
    levels: Logger.levels,
    transports: {
      Console: {
        colorize: true,
        handleExceptions: true,
        json: true,
        timestamp() {
          return new Date().toISOString();
        },
      },
    },
  };

  /**
   *
   * @private
   * @param {Class} ConsoleProxy
   * @param {Object} [options]
   * @return {Object}
   */
  _initializeConsole(ConsoleProxy, options = {}) {
    const mergedOptions = { ...this._defaultConsoleOptions, ...options };
    return new ConsoleProxy(mergedOptions);
  }

  /**
   *
   * @private
   * @param {Object} winston
   * @param {Object} [options]
   * @return {Logger}
   */
  _initializeWinston(winston, options = {}) {
    const mergedOptions = this._mergeWinstonOptions(winston, options);
    const keys = Object.keys(mergedOptions.transports);
    const transports = keys.map(key => new winston.transports[key](mergedOptions.transports[key]));
    return new winston.Logger({ ...mergedOptions, ...{ transports } });
  }

  /**
   *
   * @private
   * @param {Object} winston
   * @param {Object} options
   * @return {Object}
   */
  _mergeWinstonOptions(winston, options) {
    if (options.transports) {
      const transportOptions = {};

      Object.keys(options.transports).forEach((key) => {
        if (winston.transports[key]) {
          transportOptions[key] = options.transports[key];
        }
      });

      options.transports = transportOptions;
    }

    return { ...this._defaultWinstonOptions, ...options };
  }

  /**
   *
   * @private
   * @param {Array<string>} requestFilter
   * @param {Object} req
   * @return {Object}
   */
  _setRequestMeta(requestFilter, req) {
    if (!requestFilter.length) {
      return req;
    }

    const meta = {};

    requestFilter.forEach((key) => {
      if (req[key]) {
        meta[key] = req[key];
      }
    });

    return meta;
  }

  /**
   *
   * @param {string} message
   * @param {Object} [meta]
   * @return {void}
   */
  debug(message, meta) {
    this._client.log('debug', message, meta);
  }

  /**
   *
   * @param {string} message
   * @param {Object} [meta]
   * @return {void}
   */
  error(message, meta) {
    this._client.log('error', message, meta);
  }

  /**
   *
   * @param {string} message
   * @param {Object} [meta]
   * @return {void}
   */
  info(message, meta) {
    this._client.log('info', message, meta);
  }

  /**
   *
   * @param {string} message
   * @param {Object} [meta]
   * @return {void}
   */
  verbose(message, meta) {
    this._client.log('verbose', message, meta);
  }

  /**
   *
   * @param {string} message
   * @param {Object} [meta]
   * @return {void}
   */
  warn(message, meta) {
    this._client.log('warn', message, meta);
  }

  /**
   *
   * @param {Array<string>} [requestFilter]
   * @return {Function}
   */
  requests(requestFilter = []) {
    return (req, res, next) => {
      this.info(req.url, this._setRequestMeta(requestFilter, req));
      next();
    };
  }
}
