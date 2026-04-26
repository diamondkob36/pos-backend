import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt'; // 🌟 นำเข้า bcrypt

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(username: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    
    // 🌟 ใช้ bcrypt.compare เพื่อเปรียบเทียบรหัสที่พิมพ์มา กับรหัสที่ถูกสับไว้ในฐานข้อมูล
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { username: user.username, sub: user.id, role: user.role, name: user.name };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, username: user.username, role: user.role, name: user.name }
      };
    }
    
    throw new UnauthorizedException('รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  }
}