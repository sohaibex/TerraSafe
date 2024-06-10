import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
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
  @Post('ask-question')
  async askQuestion(
    @Body('sessionId') sessionId: string,
    @Body('question') question: string,
    @Body('currentLocation')
    currentLocation: { latitude: number; longitude: number },
  ) {
    if (!sessionId || !question || !currentLocation) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await this.chatbotService.askQuestionWithContext(
        sessionId,
        question,
        currentLocation,
      );
      return { answer: response };
    } catch (error) {
      throw new HttpException(
        'Failed to process request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
