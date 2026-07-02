import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsModule } from './trips/trips.module';
import { PoisModule } from './pois/pois.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/**/*{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    TripsModule,
    PoisModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
