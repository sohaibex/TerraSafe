import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
@ApiTags('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('ask-question')
  @ApiOperation({ summary: 'Ask a question with context' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        question: { type: 'string' },
        currentLocation: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Question answered successfully.' })
  async askQuestion(
    @Body('userId') userId: string,
    @Body('question') question: string,
    @Body('currentLocation')
    currentLocation: { latitude: number; longitude: number },
  ) {
    if (!userId || !question || !currentLocation) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.chatbotService.askQuestionWithContext(
        userId,
        question,
        currentLocation,
      );
      return { answer: response };
    } catch (error) {
      console.error('Error processing request:', error);
      throw new HttpException(
        'Failed to process request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
