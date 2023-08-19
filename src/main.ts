import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // las propiedades no decoradas en un dto se ignoran
      forbidNonWhitelisted: false, // ignora los campos que no estén en el dto
      transform: true, // intenta convertir las propiedades decoradas
      transformOptions: {
        enableImplicitConversion: true, // intenta convertir en los pipes antes de la validación
      },
      exceptionFactory: (errors) => {
        const error = errors[0].constraints
        const message = error[Object.keys(error)[0]];
        return new BadRequestException(message);
      },
      stopAtFirstError: true, // solo retorna el primer error que encuentre
    }),
  );

  await app.listen(3000);
  console.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
