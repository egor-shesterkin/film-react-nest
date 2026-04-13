import { Injectable, LoggerService } from '@nestjs/common';

type TskvLogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

@Injectable()
export class TskvLogger implements LoggerService {
  private normalizeValue(value: unknown): string {
    if (value instanceof Error) {
      return JSON.stringify({
        name: value.name,
        message: value.message,
        stack: value.stack,
      });
    }

    if (typeof value === 'string') {
      return value;
    }

    if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'bigint'
    ) {
      return value.toString();
    }

    if (value === undefined) {
      return 'undefined';
    }

    if (value === null) {
      return 'null';
    }

    return JSON.stringify(value);
  }

  private escapeValue(value: string): string {
    return value
      .replaceAll('\\', '\\\\')
      .replaceAll('\t', '\\t')
      .replaceAll('\n', '\\n')
      .replaceAll('\r', '\\r');
  }

  private formatMessage(
    level: TskvLogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const fields: Record<string, string> = {
      time: new Date().toISOString(),
      pid: process.pid.toString(),
      level,
      message: this.normalizeValue(message),
    };

    optionalParams.forEach((param, index) => {
      fields[`optional_${index}`] = this.normalizeValue(param);
    });

    const parts = Object.entries(fields).map(
      ([key, value]) => `${key}=${this.escapeValue(value)}`,
    );

    return `${parts.join('\t')}\n`;
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage('verbose', message, optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    process.stderr.write(this.formatMessage('fatal', message, optionalParams));
  }
}
