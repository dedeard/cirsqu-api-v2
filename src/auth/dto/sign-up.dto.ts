import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class SignUpDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  @Length(6, 20)
  @Matches(/^[a-zA-Z0-9]*$/)
  @Transform(({ value }) => String(value).toLocaleLowerCase())
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 64)
  password: string;
}
