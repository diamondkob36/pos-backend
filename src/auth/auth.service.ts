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

  private getSecondsUntilNextCutoff(): number {
      const now = new Date();
      const cutoffAM = new Date(now);
      cutoffAM.setHours(6, 0, 0, 0); // ตั้งเป็น 06:00:00
      const cutoffPM = new Date(now);
      cutoffPM.setHours(18, 0, 0, 0); // ตั้งเป็น 18:00:00

      let nextCutoff: Date;
      if (now < cutoffAM) {
        nextCutoff = cutoffAM;
      } else if (now < cutoffPM) {
        nextCutoff = cutoffPM;
      } else {
        // ถ้าเลย 18:00 ไปแล้ว เป้าหมายต่อไปคือ 06:00 ของวันพรุ่งนี้
        nextCutoff = new Date(now);
        nextCutoff.setDate(now.getDate() + 1);
        nextCutoff.setHours(6, 0, 0, 0);
      }

      // คำนวณส่วนต่างเวลาเป็นวินาที
      return Math.floor((nextCutoff.getTime() - now.getTime()) / 1000);
  }

  async login(username: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (user && user.isActive === false) {
      throw new UnauthorizedException('บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้จัดการ');
    }
    
    // ใช้ bcrypt.compare เพื่อเปรียบเทียบรหัสที่พิมพ์มา กับรหัสที่ถูกสับไว้ในฐานข้อมูล
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { username: user.username, sub: user.id, role: user.role, name: user.name };
      
      // 🌟 คำนวณเวลาที่เหลือก่อนถึงกะถัดไป (6 โมงเช้า หรือ 6 โมงเย็น)
      const secondsLeft = this.getSecondsUntilNextCutoff();

      return {
        // 🌟 ประทับตราเวลาหมดอายุลงไปใน Token
        access_token: this.jwtService.sign(payload, { expiresIn: secondsLeft }),
        user: { id: user.id, username: user.username, role: user.role, name: user.name }
      };
    }
    
    throw new UnauthorizedException('รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  }
}