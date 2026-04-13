import { JsonLogger } from './json-logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats log output as JSON with level and message', () => {
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    logger.log('application started', { module: 'bootstrap' });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const [payload] = consoleLogSpy.mock.calls[0];
    const parsed = JSON.parse(payload as string);

    expect(parsed).toEqual(
      expect.objectContaining({
        level: 'log',
        message: 'application started',
      }),
    );
    expect(parsed.optionalParams).toEqual([{ module: 'bootstrap' }]);
    expect(typeof parsed.timestamp).toBe('string');
    expect(typeof parsed.pid).toBe('number');
  });

  it('serializes errors in error logs', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const error = new Error('boom');

    logger.error('failure', error);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [payload] = consoleErrorSpy.mock.calls[0];
    const parsed = JSON.parse(payload as string);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('failure');
    expect(parsed.optionalParams[0]).toEqual(
      expect.objectContaining({
        name: 'Error',
        message: 'boom',
      }),
    );
  });
});
