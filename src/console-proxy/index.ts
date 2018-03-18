import { ConsoleCmdTypes, ConsoleProxyArgs } from "../types";

export default class ConsoleProxy {
  private _console = console;
  private _level: string;
  private _levels: { [key: string]: number };
  private _maxLevel: number;

  constructor({ level, levels }: ConsoleProxyArgs) {
    this._level = level;
    this._levels = levels;
    this._maxLevel = this._levels[this._level];
  }

  get console(): Console {
    return this._console;
  }

  public log(level: string, message: string, meta: any = {}): void {
    const cmd: ConsoleCmdTypes = level !== "error" && level !== "warn" && level !== "info" ? "log" : level;

    if (this._levels[level] <= this._maxLevel) {
      meta.level = level;
      meta.timestamp = new Date().toISOString();
      this._console[cmd](message, meta);
    }
  }
}
