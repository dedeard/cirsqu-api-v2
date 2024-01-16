import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from '../common/services/prisma.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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
      throw new UnprocessableEntityException('Username is already taken.');
    }

    if (emailExists) {
      throw new UnprocessableEntityException('Email is already registered.');
    }

    // Hashing password
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    // Create user
    await this.prisma.user.create({
      data: {
        ...data,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
      },
    });
  }

  async signIn({ username, password }: SignInDto) {
    // Find user by username
    let user = await this.prisma.user.findFirst({ where: { username } });

    // Check if user exists
    if (!user) {
      throw new BadRequestException(
        'Invalid username or password. User not found.',
      );
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException(
        'Invalid username or password. Incorrect password.',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { signedIn: new Date() },
    });

    user = await this.prisma.user.findFirst({ where: { id: user.id } });

    const accessToken = this.jwtService.sign({ sub: user.id });

    return {
      accessToken,
    };
  }
}
