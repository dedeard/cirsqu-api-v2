import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './env.validation';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule.forRoot({ validate }), CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
