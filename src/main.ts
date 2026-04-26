import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 🌟 อัปเดต CORS ให้อนุญาตการส่ง Token
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // อนุญาตทุก Methods
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], // 🌟 หัวใจสำคัญ: อนุญาตให้ส่ง Header Authorization ได้
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();