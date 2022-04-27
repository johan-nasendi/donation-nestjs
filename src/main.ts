import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EnvironmentUtils } from './utils/environment.utils';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription(' API documentation collection')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const isProduction = new EnvironmentUtils().isProduction();
  if (!isProduction) {
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();
