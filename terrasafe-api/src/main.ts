import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv"; // Import dotenv
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./exceptions/http-exception.filter";

const envFile = `.env.${process.env.NODE_ENV || "development"}`; // Default to "development"
dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization"
  });

  const config = new DocumentBuilder()
    .setTitle("MLR Api")
    .setDescription("MLR Api Doc")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const port = process.env.PORT || 3001;
  console.log("port", port);
  await app.listen(port);
}

bootstrap();
