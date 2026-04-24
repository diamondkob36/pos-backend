import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(username: string, pass: string) {
    // 1. ค้นหา User ใน Database
    const user = await this.prisma.user.findUnique({ where: { username } });
    
    // 2. ตรวจสอบรหัสผ่าน (ตอนนี้เช็คแบบข้อความตรงๆ ก่อน เพื่อไม่ให้กระทบข้อมูลเดิม)
    // 💡 ข้อควรระวัง: ในอนาคตควรใช้ bcrypt.compare() สำหรับรหัสผ่านที่ถูกเข้ารหัสแล้ว
    if (user && user.password === pass) {
      // 3. ถ้าผ่าน ให้สร้าง ข้อมูลที่จะฝังใน Token (Payload)
      const payload = { username: user.username, sub: user.id, role: user.role, name: user.name };
      
      // 4. ส่ง Token กลับไปให้หน้าบ้าน
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, username: user.username, role: user.role, name: user.name }
      };
    }
    
    throw new UnauthorizedException('รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  }
}