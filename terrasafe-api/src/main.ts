import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Set a global prefix for your API routes
  app.enableCors(); // Enable CORS if you expect requests from different origins
  await app.listen(3000);
}
bootstrap();
