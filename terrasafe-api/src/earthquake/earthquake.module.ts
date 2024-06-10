import { Module } from '@nestjs/common';
import { EarthquakeService } from './earthquake.service';
import { EarthquakeController } from './earthquake.controller';
import { FirebaseService } from '../firebase.service';
import { HttpModule } from '@nestjs/axios';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
@Module({
  imports: [
    HttpModule,
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  providers: [EarthquakeService, FirebaseService],
  controllers: [EarthquakeController],
})
export class EarthquakeModule {}
