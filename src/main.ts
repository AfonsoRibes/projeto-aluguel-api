import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API NestJS')
    .setDescription('Documentação da API NestJS')
    .setVersion('1.0')
    .addBearerAuth() // para usar autenticação JWT via Bearer token
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // URL: /api para acessar Swagger UI

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
