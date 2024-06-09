import { Module } from '@nestjs/common';
import { EarthquakeService } from './earthquake.service';
import { EarthquakeController } from './earthquake.controller';
import { FirebaseService } from '../firebase.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [EarthquakeService, FirebaseService],
  controllers: [EarthquakeController],
})
export class EarthquakeModule {}
