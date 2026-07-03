import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, code: string): Promise<any> {
    const user = await this.usersService.findOne(phone);
    if (user && await this.usersService.validatePassword(code, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { phone: user.phone, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
      user,
    };
  }

  async register(phone: string, code: string) {
    const existingUser = await this.usersService.findOne(phone);
    if (existingUser) {
      const { password, ...result } = existingUser;
      return result;
    }
    const user = await this.usersService.create({ phone, password: code });
    const { password, ...result } = user;
    return result;
  }
}
