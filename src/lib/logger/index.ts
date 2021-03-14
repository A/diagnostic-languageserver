import EventEmitter from 'eventemitter3';

interface Config {
  logLevel: number;
}

interface MessageEvent {
  type: keyof typeof LogLevel;
  message: string;
}

type Callback = (event: MessageEvent) => void;

export enum LogLevel {
  none,
  error,
  warn,
  info,
  log
}

const DEFAULT_CONFIG = {
  logLevel: LogLevel.warn,
}

class Logger {
  private eventEmitter: EventEmitter;
  private config: Config;

  constructor() {
    this.config = Object.assign({}, DEFAULT_CONFIG);
    this.eventEmitter = new EventEmitter();
  }

  public configure = (config: Partial<Config>) => {
    this.config = Object.assign({}, this.config, config);
  }

  private emit = (type: keyof typeof LogLevel, message: string) => {
    if (this.config.logLevel < LogLevel[type]) {
      return;
    }
    this.eventEmitter.emit('message', { type, message });
  }

  public onMessage = (callback: Callback) => this.eventEmitter.on('message', callback);
  public offMessage = (callback: Callback) => this.eventEmitter.removeListener('message', callback);
  public log = (message: string) => this.emit('log', message);
  public info = (message: string) => this.emit('info', message);
  public warn = (message: string) => this.emit('warn', message);
  public error = (message: string) => this.emit('error', message);
}

export default new Logger();
