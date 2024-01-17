import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AllowedMetaData } from './auth-metadata.guard'
import { Reflector } from '@nestjs/core'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.getAllAndOverride<AllowedMetaData[]>('auth', [context.getHandler(), context.getClass()])

    if (metadata?.includes('skip')) {
      return true
    }

    try {
      await super.canActivate(context)
    } catch (error: any) {
      if (!metadata?.includes('optional')) {
        throw error
      }
    }

    return true
  }
}
