import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { mkdirSync } from 'fs';
import { join } from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  // Ensure upload directory exists before any request hits multer
  mkdirSync(join(process.cwd(), 'uploads', 'images'), { recursive: true });

  const app = await NestFactory.create(AppModule);

  // ── Trust proxy — required for correct IP extraction behind Nginx / ALB ──
  // Set to the number of hops in front of the app (1 = one reverse proxy)
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // ── Security headers ──────────────────────────────────────────────────────
  app.use(helmet());

  // ── CORS — lock to your actual frontend origin, not '*' ──────────────────
  app.enableCors({
    origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ── Global rate limit — coarse outer limit (fine-grained via Throttler) ──
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // ── Global validation ─────────────────────────────────────────────────────
  // whitelist strips unknown properties before they reach your DTOs
  // forbidNonWhitelisted rejects requests that contain them (not just strips)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,             // auto-cast primitives (e.g. string → number)
      transformOptions: {
        enableImplicitConversion: false, // explicit is safer
      },
    }),
  );

  // ── Swagger (non-production only) ─────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Bazar API')
      .setDescription('API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerConfig));
  }

  await app.listen(process.env.PORT ?? 3020);
}

bootstrap();
