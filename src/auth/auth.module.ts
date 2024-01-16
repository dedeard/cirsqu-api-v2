import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [AuthController],
  imports: [CommonModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
