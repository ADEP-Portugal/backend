import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  dotenv.config({ path: 'prisma/.env' });

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(requestIp.mw());

  const secret = 'sua_chave_secreta_123';

  app.use(cookieParser(secret));

  app.use(helmet());

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Adep API by @sartodev')
    .setDescription('Adep API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, '127.0.0.1');
}
bootstrap();
