import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/sign-up.dto'
import { SignInDto } from './dto/sign-in.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() data: SignUpDto) {
    return this.authService.signUp(data)
  }

  @Post('/sign-in')
  signIn(@Body() data: SignInDto) {
    return this.authService.signIn(data)
  }

  @Post('/refresh')
  refresh(@Body('refresh-token') refreshToken: string) {
    return this.authService.refresh(refreshToken)
  }
}
