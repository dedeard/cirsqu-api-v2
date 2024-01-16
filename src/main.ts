import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';

// Function to create UnprocessableEntityException from validation errors
function createExceptionFromErrors(errors: ValidationError[]) {
  const firstError = errors[0];
  const errorMessage = Object.values(firstError.constraints)[0];
  return new UnprocessableEntityException(errorMessage);
}

// Bootstrap function to initialize the NestJS application
async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Get configuration service instance
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT');

  // Configure global validation pipe
  const validationPipe = new ValidationPipe({
    stopAtFirstError: true,
    whitelist: true,
    transform: true,
    exceptionFactory: createExceptionFromErrors,
  });

  // Apply global validation pipe to the entire application
  app.useGlobalPipes(validationPipe);

  // Start the application and listen on the specified port
  await app.listen(port);
}

// Call the bootstrap function to start the application
bootstrap();
