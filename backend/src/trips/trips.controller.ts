import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto, UpdateTripDto } from './trips.dto';
import { CreateTripPoiDto, MoveTripPoiDto, ReorderTripPoiDto } from './trip-poi.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  findAll(@Request() req) {
    return this.tripsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tripsService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() createTripDto: CreateTripDto, @Request() req) {
    return this.tripsService.create(createTripDto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto, @Request() req) {
    return this.tripsService.update(id, updateTripDto, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.tripsService.delete(id, req.user.id);
  }

  @Post(':id/pois')
  addPoi(@Param('id') id: string, @Body() createTripPoiDto: CreateTripPoiDto, @Request() req) {
    return this.tripsService.addPoi(id, createTripPoiDto, req.user.id);
  }

  @Delete(':id/pois/:poiId')
  removePoi(@Param('id') id: string, @Param('poiId') poiId: string, @Request() req) {
    return this.tripsService.removePoi(id, poiId, req.user.id);
  }

  @Patch(':id/pois/:poiId/day')
  movePoi(@Param('id') id: string, @Param('poiId') poiId: string, @Body() moveTripPoiDto: MoveTripPoiDto, @Request() req) {
    return this.tripsService.movePoi(id, poiId, moveTripPoiDto, req.user.id);
  }

  @Patch(':id/days/:day/pois/reorder')
  reorderPois(@Param('id') id: string, @Param('day') day: number, @Body() reorderTripPoiDto: ReorderTripPoiDto) {
    return this.tripsService.reorderPois(id, day, reorderTripPoiDto);
  }

  @Post(':id/days')
  addDay(@Param('id') id: string, @Request() req) {
    return this.tripsService.addDay(id, req.user.id);
  }

  @Delete(':id/days/:day')
  removeDay(@Param('id') id: string, @Param('day') day: number, @Request() req) {
    return this.tripsService.removeDay(id, day, req.user.id);
  }
}
