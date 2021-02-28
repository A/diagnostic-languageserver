import logger from '.';

describe('logger', () => {
  afterEach(() => {
    logger.configure({ logLevel: 0 })
    // @ts-ignore just for the sake of simplicity
    logger.eventEmitter.removeAllListeners();
  })

  it('on logLevel "0" no logs should be emitted', () => {
    logger.configure({ logLevel: 0})
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
    logger.configure({ logLevel: 4 });
    const message = 'message!';
    const callback = jest.fn();
    logger.onMessage(callback);
    logger.error(message);
    logger.warn(message);
    logger.info(message);
    logger.log(message);
    expect(callback).toBeCalledTimes(4);
  });

  describe('logger.configure()', () => {
    it('should update logLevel', () => {
      logger.configure({ logLevel: 4 });
      const cb = jest.fn();
      logger.onMessage(cb);
      logger.log('test');
      expect(cb).toBeCalledTimes(1);
      cb.mockClear();
      logger.configure({ logLevel: 0 });
      logger.log('test');
      expect(cb).toBeCalledTimes(0);
    });
  });

  describe('logger.error()', () => {
    it('should emit an error message if logLevel is greater then 0', () => {
      logger.configure({ logLevel: 1 });
      const message = 'error!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.error(message);
      expect(callback).toBeCalledWith({ type: 'error', message });
    });

    it('should not emit an error message if logLevel is lower then 1', () => {
      logger.configure({ logLevel: 0 });
      const message = 'error!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.error(message);
      expect(callback).not.toBeCalled();
    });
  });

  describe('logger.warn()', () => {
    it('should emit a warning message if logLevel is greater then 1', () => {
      logger.configure({ logLevel: 2 });
      const message = 'warning!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.warn(message);
      expect(callback).toBeCalledWith({ type: 'warn', message });
    });

    it('should not emit a warning message if logLevel is lower then 2', () => {
      logger.configure({ logLevel: 1 });
      const message = 'warning!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.warn(message);
      expect(callback).not.toBeCalled();
    });
  });

  describe('logger.info()', () => {
    it('should emit an info message if logLevel is greater then 2', () => {
      logger.configure({ logLevel: 3 });
      const message = 'info!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.info(message);
      expect(callback).toBeCalledWith({ type: 'info', message });
    });

    it('should not emit an info message if logLevel is lower then 3', () => {
      logger.configure({ logLevel: 2 });
      const message = 'info!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.info(message);
      expect(callback).not.toBeCalled();
    });
  });

  describe('logger.log()', () => {
    it('should emit a log message if logLevel is greater then 3', () => {
      logger.configure({ logLevel: 4 });
      const message = 'log!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.log(message);
      expect(callback).toBeCalledWith({ type: 'log', message });
    });

    it('should not emit an info message if logLevel is lower then 4', () => {
      logger.configure({ logLevel: 3 });
      const message = 'log!';
      const callback = jest.fn();
      logger.onMessage(callback);
      logger.log(message);
      expect(callback).not.toBeCalled();
    });
  });
});
