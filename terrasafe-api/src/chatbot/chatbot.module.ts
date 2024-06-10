import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { EarthquakeService } from '../earthquake/earthquake.service';
import { FirebaseService } from '../firebase.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
@Module({
  imports: [HttpModule],
  providers: [ChatbotService, EarthquakeService, FirebaseService],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
