import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { Trip } from './trip.entity';
import { TripPoi } from './trip-poi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripPoi])],
  controllers: [TripsController],
  providers: [TripsService],
})
export class TripsModule {}
