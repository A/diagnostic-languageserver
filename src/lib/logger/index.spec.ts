import Logger,  from '.';

describe('Logger', () => {
  it('default logLevel should be "none"', () => {
    const logger = new Logger();
    const message = 'message!';
    const callback = jest.fn();
    logger.onMessage(callback);
    logger.error(message);
    logger.warn(message);
    logger.info(message);
    logger.log(message);
    expect(callback).not.toBeCalled();
  });

  it('on logLevel "4" should emit all message events', () => {
    const logger = new Logger({ logLevel: 4 });
    const message = 'message!';
    const callback = jest.fn();
    logger.onMessage(callback);
    logger.error(message);
    logger.warn(message);
    logger.info(message);
    logger.log(message);
    expect(callback).toBeCalledTimes(4);
  });

  describe('Logger.error()', () => {
    it('should emit an error message if logLevel is greater then 0', () => {
      const logger = new Logger({ logLevel: 1 });
      const message = 'error!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.error(message);
      expect(callback).toBeCalledWith({ type: 'error', message });
    });

    it('should not emit an error message if logLevel is lower then 1', () => {
      const logger = new Logger({ logLevel: 0 });
      const message = 'error!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.error(message);
      expect(callback).not.toBeCalled();
    });
  });

  describe('Logger.warn()', () => {
    it('should emit a warning message if logLevel is greater then 1', () => {
      const logger = new Logger({ logLevel: 2 });
      const message = 'warning!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.warn(message);
      expect(callback).toBeCalledWith({ type: 'warn', message });
    });

    it('should not emit a warning message if logLevel is lower then 2', () => {
      const logger = new Logger({ logLevel: 1 });
      const message = 'warning!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.warn(message);
      expect(callback).not.toBeCalled();
    });
  });

  describe('Logger.info()', () => {
    it('should emit an info message if logLevel is greater then 2', () => {
      const logger = new Logger({ logLevel: 3 });
      const message = 'info!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.info(message);
      expect(callback).toBeCalledWith({ type: 'info', message });
    });

    it('should not emit an info message if logLevel is lower then 3', () => {
      const logger = new Logger({ logLevel: 2 });
      const message = 'info!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.info(message);
      expect(callback).not.toBeCalled();
    });
  });

  describe('Logger.log()', () => {
    it('should emit a log message if logLevel is greater then 3', () => {
      const logger = new Logger({ logLevel: 4 });
      const message = 'log!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.log(message);
      expect(callback).toBeCalledWith({ type: 'log', message });
    });

    it('should not emit an info message if logLevel is lower then 4', () => {
      const logger = new Logger({ logLevel: 3 });
      const message = 'log!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.log(message);
      expect(callback).not.toBeCalled();
    });
  });
});
