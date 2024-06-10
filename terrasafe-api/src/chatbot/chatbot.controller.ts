import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
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
  async askQuestionWithContext(
    @Body('question') question: string,
    @Body('currentLocation')
    currentLocation: { latitude: number; longitude: number },
  ) {
    return this.chatbotService.askQuestionWithContext(
      question,
      currentLocation,
    );
  }
}
