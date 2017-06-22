/**
 *
 * The console proxy
 */
export default class ConsoleProxy {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void}
   */
  constructor({ level, levels } = {}) {
    this._level = level;
    this._levels = levels;
    this._maxLevel = this._levels[this._level];
  }

  /**
   *
   * @private
   * @type {Console}
   */
  _console = console;

  /**
   *
   * @private
   * @type {string}
   */
  _level;

  /**
   *
   * @private
   * @type {Object}
   */
  _levels;

  /**
   *
   * @private
   * @type {number}
   */
  _maxLevel;

  /**
   *
   * @param {string} level
   * @param {string} message
   * @param {Object} [meta]
   * @return {void}
   */
  log(level, message, meta = {}) {
    const cmd = level === 'verbose' || level === 'debug' ? 'log' : level;

    if (this._levels[level] <= this._maxLevel) {
      meta.level = level;
      meta.timestamp = new Date().toISOString();
      this._console[cmd](message, meta);
    }
  }
}
