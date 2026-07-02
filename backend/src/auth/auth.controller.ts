import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/users.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.phone, loginDto.code);
    if (!user) {
      return { code: 401, message: '手机号或验证码错误' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() loginDto: LoginDto) {
    const user = await this.authService.register(loginDto.phone, loginDto.code);
    return this.authService.login(user);
  }

  @Post('send-code')
  async sendCode(@Body('phone') phone: string) {
    return { code: 200, message: '验证码已发送', data: { phone } };
  }
}
