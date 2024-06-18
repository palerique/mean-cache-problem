import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle('Mean Cache Problem API')
        .setDescription('The Mean Cache Problem API')
        .setVersion('1.0')
        .addTag('mean-cache-problem')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3002);
}

bootstrap();
