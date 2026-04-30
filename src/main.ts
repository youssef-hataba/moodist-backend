import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('ENV CHECK:', process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
}

bootstrap().catch((err) => {
  console.log('Database URL check:', process.env.DATABASE_URL);
  console.error('Error during bootstrap:', err);
  process.exit(1);
});