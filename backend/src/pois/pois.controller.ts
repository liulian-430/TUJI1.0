import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PoisService } from './pois.service';
import { SearchPoiDto } from './pois.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pois')
@UseGuards(JwtAuthGuard)
export class PoisController {
  constructor(private readonly poisService: PoisService) {}

  @Get()
  findAll(@Query() searchPoiDto: SearchPoiDto) {
    return this.poisService.findAll(searchPoiDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poisService.findOne(id);
  }

  @Get('search')
  search(@Query('keyword') keyword: string) {
    return this.poisService.search(keyword);
  }

  @Get('recommend')
  recommend(@Query('city') city?: string) {
    return this.poisService.recommend(city);
  }
}
