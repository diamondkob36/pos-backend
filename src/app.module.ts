import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service'; // <-- 1. นำเข้าตรงนี้
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService], // <-- 2. เพิ่ม PrismaService เข้าไปที่นี่
})
export class AppModule {}