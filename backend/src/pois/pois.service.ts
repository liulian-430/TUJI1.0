import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Poi } from './poi.entity';
import { SearchPoiDto } from './pois.dto';

@Injectable()
export class PoisService {
  constructor(
    @InjectRepository(Poi)
    private poiRepository: Repository<Poi>,
  ) {}

  async findAll(searchPoiDto: SearchPoiDto): Promise<Poi[]> {
    const query = this.poiRepository.createQueryBuilder('poi');

    if (searchPoiDto.keyword) {
      query.andWhere('poi.name LIKE :keyword', { keyword: `%${searchPoiDto.keyword}%` });
    }
    if (searchPoiDto.city) {
      query.andWhere('poi.city LIKE :city', { city: `%${searchPoiDto.city}%` });
    }
    if (searchPoiDto.type) {
      query.andWhere('poi.type = :type', { type: searchPoiDto.type });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Poi> {
    return this.poiRepository.findOne({ where: { id } });
  }

  async search(keyword: string): Promise<Poi[]> {
    return this.poiRepository.find({
      where: [
        { name: Like(`%${keyword}%`) },
        { tags: Like(`%${keyword}%`) },
      ],
    });
  }

  async recommend(city?: string): Promise<Poi[]> {
    const query = this.poiRepository.createQueryBuilder('poi');
    if (city) {
      query.andWhere('poi.city LIKE :city', { city: `%${city}%` });
    }
    query.orderBy('poi.rating', 'DESC');
    return query.take(10).getMany();
  }
}
