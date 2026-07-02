import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
