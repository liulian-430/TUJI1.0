import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { TripPoi } from './trip-poi.entity';
import { CreateTripDto, UpdateTripDto } from './trips.dto';
import { CreateTripPoiDto, MoveTripPoiDto, ReorderTripPoiDto } from './trip-poi.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(TripPoi)
    private tripPoiRepository: Repository<TripPoi>,
  ) {}

  async findAll(userId: string): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { userId },
      relations: ['pois'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Trip> {
    return this.tripRepository.findOne({
      where: { id, userId },
      relations: ['pois'],
    });
  }

  async create(createTripDto: CreateTripDto, userId: string): Promise<Trip> {
    const trip = this.tripRepository.create({
      ...createTripDto,
      userId,
    });
    return this.tripRepository.save(trip);
  }

  async update(id: string, updateTripDto: UpdateTripDto, userId: string): Promise<Trip> {
    await this.tripRepository.update({ id, userId }, updateTripDto);
    return this.findOne(id, userId);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.tripRepository.delete({ id, userId });
  }

  async addPoi(tripId: string, createTripPoiDto: CreateTripPoiDto, userId: string): Promise<TripPoi> {
    const trip = await this.findOne(tripId, userId);
    const maxOrder = Math.max(0, ...trip.pois.filter(p => p.day === createTripPoiDto.day).map(p => p.order));
    
    const poi = this.tripPoiRepository.create({
      ...createTripPoiDto,
      tripId,
      order: maxOrder + 1,
    });
    return this.tripPoiRepository.save(poi);
  }

  async removePoi(tripId: string, poiId: string, userId: string): Promise<void> {
    await this.tripPoiRepository.delete({ id: poiId, tripId });
  }

  async movePoi(tripId: string, poiId: string, moveTripPoiDto: MoveTripPoiDto, userId: string): Promise<TripPoi> {
    const trip = await this.findOne(tripId, userId);
    const maxOrder = Math.max(0, ...trip.pois.filter(p => p.day === moveTripPoiDto.day).map(p => p.order));
    
    await this.tripPoiRepository.update({ id: poiId, tripId }, {
      day: moveTripPoiDto.day,
      order: maxOrder + 1,
    });
    return this.tripPoiRepository.findOne({ where: { id: poiId } });
  }

  async reorderPois(tripId: string, day: number, reorderTripPoiDto: ReorderTripPoiDto): Promise<TripPoi[]> {
    const { fromIndex, toIndex } = reorderTripPoiDto;
    const pois = await this.tripPoiRepository.find({
      where: { tripId, day },
      order: { order: 'ASC' },
    });

    const [moved] = pois.splice(fromIndex, 1);
    pois.splice(toIndex, 0, moved);

    for (let i = 0; i < pois.length; i++) {
      pois[i].order = i + 1;
    }

    await this.tripPoiRepository.save(pois);
    return this.tripPoiRepository.find({ where: { tripId, day }, order: { order: 'ASC' } });
  }

  async addDay(tripId: string, userId: string): Promise<Trip> {
    const trip = await this.findOne(tripId, userId);
    trip.days += 1;
    return this.tripRepository.save(trip);
  }

  async removeDay(tripId: string, day: number, userId: string): Promise<Trip> {
    await this.tripPoiRepository.delete({ tripId, day });
    const trip = await this.findOne(tripId, userId);
    trip.days = Math.max(1, trip.days - 1);
    return this.tripRepository.save(trip);
  }
}
