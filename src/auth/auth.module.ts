import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service'; // ตรวจสอบ path ให้ตรงกับไฟล์ของคุณอนุวรรตน์นะครับ

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_POS_2026', // 🌟 รหัสลับสำหรับสร้าง Token (ความจริงควรซ่อนไว้ในไฟล์ .env)
      signOptions: { expiresIn: '1d' }, // 🌟 ให้ Token มีอายุ 1 วัน
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}