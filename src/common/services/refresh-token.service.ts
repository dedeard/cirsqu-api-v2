import { Injectable } from '@nestjs/common'
import { promisify } from 'util'
import { randomBytes } from 'crypto'
import { PrismaService } from './prisma.service'
import { User } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(userId: string) {
    const buffer = await promisify<number, Buffer>(randomBytes)(38)
    const token = buffer.toString('hex')
    await this.prisma.refreshToken.create({ data: { token, userId } })
    return token
  }

  async getUserIfTokenIsValid(refreshToken: string): Promise<User | null> {
    const token = await this.prisma.refreshToken.findFirst({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (token) {
      const expireDays = this.configService.get<number>('REFRESH_TOKEN_EXPIRATION')
      const now = new Date()
      const expiredAt = token.createdAt
      expiredAt.setDate(expiredAt.getDate() + expireDays)
      if (now < expiredAt) {
        return token.user
      }
      await this.prisma.refreshToken.delete({ where: { id: token.id } })
    }
    return null
  }

  async revoke(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } })
  }

  async revokeByUserId(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } })
  }
}
