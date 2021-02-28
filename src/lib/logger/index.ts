import EventEmitter from 'eventemitter3';

interface Config {
  logLevel: number;
}

interface MessageEvent {
  type: keyof typeof LogLevel;
  message: string;
}

type Callback = (event: MessageEvent) => void;

enum LogLevel {
  none,
  error,
  warn,
  info,
  log
}

const DEFAULT_CONFIG = {
  logLevel: 0,
}

class Logger {
  private eventEmitter: EventEmitter;
  private config: Config;

  constructor(config?: Partial<Config>) {
    this.config = Object.assign({}, DEFAULT_CONFIG, config);
    this.eventEmitter = new EventEmitter();
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

export default Logger;
