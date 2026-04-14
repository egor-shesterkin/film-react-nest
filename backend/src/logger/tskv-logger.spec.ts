import { TskvLogger } from './tskv-logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('writes log output in TSKV format to stdout', () => {
    const stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    logger.log('application started', { module: 'bootstrap' });

    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const [payload] = stdoutSpy.mock.calls[0];
    const line = payload as string;

    expect(line.endsWith('\n')).toBe(true);
    expect(line).toContain('\tlevel=log\t');
    expect(line).toContain('\tmessage=application started\t');
    expect(line).toContain('optional_0={"module":"bootstrap"}');
  });

  it('escapes tabs and line breaks in message fields', () => {
    const stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    logger.warn('line1\tline2\nline3');

    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const [payload] = stdoutSpy.mock.calls[0];
    const line = payload as string;

    expect(line).toContain('level=warn');
    expect(line).toContain('message=line1\\tline2\\nline3');
  });

  it('writes error logs to stderr', () => {
    const stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);

    logger.error('failure');

    expect(stderrSpy).toHaveBeenCalledTimes(1);
    const [payload] = stderrSpy.mock.calls[0];
    const line = payload as string;

    expect(line).toContain('level=error');
    expect(line).toContain('message=failure');
  });

  it('keeps stable field order for parser compatibility', () => {
    const stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    logger.log('ordered', 'extra');

    expect(stdoutSpy).toHaveBeenCalledTimes(1);
    const [payload] = stdoutSpy.mock.calls[0];
    const line = payload as string;
    const withoutNewline = line.replace(/\n$/, '');
    const fields = withoutNewline.split('\t');

    expect(fields).toHaveLength(5);
    expect(fields[0]).toMatch(/^time=/);
    expect(fields[1]).toMatch(/^pid=/);
    expect(fields[2]).toBe('level=log');
    expect(fields[3]).toBe('message=ordered');
    expect(fields[4]).toBe('optional_0=extra');
  });
});
