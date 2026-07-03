import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { POIType } from '../trips/trip-poi.entity';

@Entity('pois')
export class Poi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: POIType;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  duration: string;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  tags: string;

  @Column({ nullable: true })
  city: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
