import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    .setTitle('UP Project API')
    .setDescription('Esta es la documentación del proyecto')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);

  app.enableCors();
}
bootstrap();