import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EarthquakeModule } from './earthquake/earthquake.module';
import { FirebaseModule } from './firebase.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [EarthquakeModule, HttpModule, FirebaseModule, ChatbotModule],
})
export class AppModule {}
