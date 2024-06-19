import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { EarthquakeService } from '../earthquake/earthquake.service';
import { FirebaseService } from '../firebase.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
@Module({
  imports: [
    HttpModule,
    ElasticsearchModule.register({
      node: 'http://34.163.233.133:9200',
    }),
  ],
  providers: [ChatbotService, EarthquakeService, FirebaseService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
