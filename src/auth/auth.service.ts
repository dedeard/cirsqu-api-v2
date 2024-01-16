import { Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from '../common/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async usernameExists(username: string, excludeId?: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: username.toLowerCase(),
        id: { not: excludeId },
      },
    });
    return !!user;
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        id: { not: excludeId },
      },
    });
    return !!user;
  }

  async signUp(data: SignUpDto): Promise<void> {
    const { username, email } = data;

    // Check if username or email already exist
    const usernameExists = await this.usernameExists(username);
    const emailExists = await this.emailExists(email);

    if (usernameExists) {
      throw new NotFoundException('Username is already taken.');
    }

    if (emailExists) {
      throw new NotFoundException('Email is already registered.');
    }

    // Create user
    await this.prisma.user.create({
      data: {
        ...data,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
      },
    });
  }
}
