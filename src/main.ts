import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

import { AppModule } from './app.module';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/Bogota');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // las propiedades no decoradas en un dto se ignoran
      forbidNonWhitelisted: false, // ignora los campos que no estén en el dto
      transform: true, // intenta convertir las propiedades decoradas
      transformOptions: {
        enableImplicitConversion: true, // intenta convertir en los pipes antes de la validación
      },
      exceptionFactory: (errors) => {
        // Los dto mandaran el mensaje de error como un string
        const error = errors[0].constraints;
        const message = error[Object.keys(error)[0]];
        return new BadRequestException(message);
      },
      stopAtFirstError: true, // solo retorna el primer error que encuentre
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Lito Students API')
    .setDescription('Esta es la documentación del proyecto')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'defaultBearerAuth',
          schema: {
            description: 'Autenticación por medio de JWT como bearer auth',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document, options);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);

  app.enableCors();
}
bootstrap();


