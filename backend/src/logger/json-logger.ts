import { Injectable, LoggerService } from '@nestjs/common';

type JsonLogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(
    level: JsonLogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      pid: process.pid,
      level,
      message: this.normalizeValue(message),
      optionalParams: optionalParams.map((param) => this.normalizeValue(param)),
    });
  }

  private normalizeValue(value: unknown): unknown {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
      };
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    return value;
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.info(this.formatMessage('verbose', message, optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('fatal', message, optionalParams));
  }
}
