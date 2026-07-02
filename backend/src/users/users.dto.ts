import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  phone: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  email?: string;
}

export class LoginDto {
  @IsString()
  phone: string;

  @IsString()
  code: string;
}
