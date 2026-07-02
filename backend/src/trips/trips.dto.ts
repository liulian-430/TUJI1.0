import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { TripStatus } from './trip.entity';

export class CreateTripDto {
  @IsString()
  name: string;

  @IsString()
  destination: string;

  @IsNumber()
  days: number;

  @IsOptional()
  @IsNumber()
  nights?: number;

  @IsOptional()
  @IsNumber()
  people?: number;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsEnum(['planning', 'in_progress', 'completed'])
  status?: TripStatus;

  @IsOptional()
  @IsNumber()
  budget?: number;
}

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsNumber()
  days?: number;

  @IsOptional()
  @IsEnum(['planning', 'in_progress', 'completed'])
  status?: TripStatus;

  @IsOptional()
  @IsNumber()
  budget?: number;
}
