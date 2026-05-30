import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  private getSecondsUntilNextCutoff(): number {
      const now = new Date();
      const cutoffAM = new Date(now);
      cutoffAM.setHours(6, 0, 0, 0);
      const cutoffPM = new Date(now);
      cutoffPM.setHours(18, 0, 0, 0);

      let nextCutoff: Date;
      if (now < cutoffAM) {
        nextCutoff = cutoffAM;
      } else if (now < cutoffPM) {
        nextCutoff = cutoffPM;
      } else {
        nextCutoff = new Date(now);
        nextCutoff.setDate(now.getDate() + 1);
        nextCutoff.setHours(6, 0, 0, 0);
      }

      return Math.floor((nextCutoff.getTime() - now.getTime()) / 1000);
  }

  async login(username: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (user && user.isActive === false) {
      throw new UnauthorizedException('บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้จัดการ');
    }
    
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { username: user.username, sub: user.id, role: user.role, name: user.name };
      const secondsLeft = this.getSecondsUntilNextCutoff();

      return {
        access_token: this.jwtService.sign(payload, { expiresIn: secondsLeft }),
        user: { id: user.id, username: user.username, role: user.role, name: user.name }
      };
    }
    
    throw new UnauthorizedException('รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  }
}