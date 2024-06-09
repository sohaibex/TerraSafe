import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EarthquakeModule } from './earthquake/earthquake.module';
import { FirebaseModule } from './firebase.module';

@Module({
  imports: [EarthquakeModule, HttpModule, FirebaseModule],
})
export class AppModule {}
