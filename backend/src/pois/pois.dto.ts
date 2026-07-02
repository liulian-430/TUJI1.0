import { IsString, IsOptional } from 'class-validator';

export class SearchPoiDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
