import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  dotenv.config(); // ✅ correct usage

  const app = await NestFactory.create(AppModule); // ✅ create app FIRST

  // ✅ Swagger config (rename variable!)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bazar API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  //these sections should be improved
  //app.set('trust proxy', 1)
  app.use(helmet());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  await app.listen(3020);
}

bootstrap();
