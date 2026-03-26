import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configProvider } from './app.config.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [configProvider],
  exports: ['CONFIG'],
})
export class AppConfigModule {}
