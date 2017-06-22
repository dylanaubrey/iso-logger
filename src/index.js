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
  constructor({ consoleOptions, env, newInstance = false, winstonOptions } = {}) {
    if (instance && !newInstance) {
      return instance;
    }

    instance = this;
    this._client = this._initialize(env, consoleOptions, winstonOptions);
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
   * @param {Object} [options]
   * @return {Object}
   */
  _initializeConsole(options = {}) {
    const ConsoleProxy = require('./console-proxy').default; // eslint-disable-line global-require
    const mergedOptions = { ...this._defaultConsoleOptions, ...options };
    return new ConsoleProxy(mergedOptions);
  }

  /**
   *
   * @private
   * @param {Object} [options]
   * @return {Logger}
   */
  _initializeWinston(options = {}) {
    const winston = require('winston'); // eslint-disable-line global-require
    const mergedOptions = this._mergeWinstonOptions(winston, options);
    const keys = Object.keys(mergedOptions.transports);
    const transports = keys.map(key => new winston.transports[key](mergedOptions.transports[key]));
    return new winston.Logger({ ...mergedOptions, ...{ transports } });
  }

  /**
   *
   * @private
   * @param {string} env
   * @param {Object} [consoleOptions]
   * @param {Object} [winstonOptions]
   * @return {Object|Logger}
   */
  _initialize(env, consoleOptions, winstonOptions) {
    let logger;

    switch (env) {
      case 'node':
        logger = this._initializeWinston(winstonOptions);
        break;
      case 'web':
        logger = this._initializeConsole(consoleOptions);
        break;
      default:
        throw new Error('iso-logger: expecting "env" argument to be set to "node" or "web"');
    }

    return logger;
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
