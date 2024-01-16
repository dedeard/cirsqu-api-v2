import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { RefreshTokenService } from './services/refresh-token.service';

@Module({
  providers: [PrismaService, RefreshTokenService],
  exports: [PrismaService, RefreshTokenService],
})
export class CommonModule {}
