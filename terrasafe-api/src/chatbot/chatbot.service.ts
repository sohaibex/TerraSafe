import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import * as admin from 'firebase-admin';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';
import { EarthquakeService } from '../earthquake/earthquake.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ChatbotService {
  constructor(
    private readonly earthquakeService: EarthquakeService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async askQuestionWithContext(
    question: string,
    currentLocation: { latitude: number; longitude: number },
  ) {
    const context =
      await this.earthquakeService.fetchAllEarthquakesWithHelpRequests();

    const payload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that provides information about earthquakes and related help requests.',
        },
        {
          role: 'user',
          content: `Here is the current data about earthquakes and help requests: ${JSON.stringify(context)}. Now, based on this data, please answer the following question: ${question} My current location is latitude ${currentLocation.latitude} and longitude ${currentLocation.longitude}.`,
        },
      ],
      max_tokens: 300,
    };

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new HttpException(
        'Failed to get response from OpenAI API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
