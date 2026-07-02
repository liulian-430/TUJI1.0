import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoisController } from './pois.controller';
import { PoisService } from './pois.service';
import { Poi } from './poi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poi])],
  controllers: [PoisController],
  providers: [PoisService],
})
export class PoisModule {}
