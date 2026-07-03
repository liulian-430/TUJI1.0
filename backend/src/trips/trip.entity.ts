import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TripPoi } from './trip-poi.entity';

export type TripStatus = 'planning' | 'in_progress' | 'completed';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  destination: string;

  @Column()
  days: number;

  @Column({ nullable: true })
  nights: number;

  @Column({ nullable: true })
  people: number;

  @Column()
  startDate: string;

  @Column({ default: 'planning' })
  status: TripStatus;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true, type: 'decimal' })
  budget: number;

  @Column({ nullable: true, type: 'decimal' })
  spent: number;

  @Column()
  userId: string;

  @OneToMany(() => TripPoi, (tripPoi) => tripPoi.trip, { cascade: true })
  pois: TripPoi[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
