import { IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class SignInDto {
  @IsString()
  @Transform(({ value }) => String(value).toLocaleLowerCase())
  username: string

  @IsString()
  password: string
}
