import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { POIType } from './trip-poi.entity';

export class CreateTripPoiDto {
  @IsString()
  name: string;

  @IsEnum(['scenic', 'food', 'hotel', 'shopping'])
  type: POIType;

  @IsString()
  duration: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsNumber()
  day: number;

  @IsOptional()
  @IsString()
  originalPoiId?: string;
}

export class MoveTripPoiDto {
  @IsNumber()
  day: number;
}

export class ReorderTripPoiDto {
  @IsNumber()
  fromIndex: number;

  @IsNumber()
  toIndex: number;
}
