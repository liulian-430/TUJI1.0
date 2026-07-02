import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Trip } from './trip.entity';

export type POIType = 'scenic' | 'food' | 'hotel' | 'shopping';

@Entity('trip_pois')
export class TripPoi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['scenic', 'food', 'hotel', 'shopping'] })
  type: POIType;

  @Column()
  duration: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column()
  image: string;

  @Column({ nullable: true, type: 'decimal' })
  latitude: number;

  @Column({ nullable: true, type: 'decimal' })
  longitude: number;

  @Column()
  day: number;

  @Column()
  order: number;

  @Column({ nullable: true })
  originalPoiId: string;

  @ManyToOne(() => Trip, (trip) => trip.pois)
  trip: Trip;

  @Column()
  tripId: string;

  @CreateDateColumn()
  createdAt: Date;
}
