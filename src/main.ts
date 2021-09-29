import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.SESSION_SECRET));
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.referrerPolicy());
  app.use(bodyParser.json());
  app.use('/', csrf({ cookie: { httpOnly: true } }));
  if (process.env.NODE_ENV === 'DEV') {
    const config = new DocumentBuilder()
      .setTitle('Test APIs')
      .setDescription('Test Api Description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();
