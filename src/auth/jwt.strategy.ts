import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_POS_2026', // 🌟 ต้องตรงกับใน AuthModule
    });
  }

  // ฟังก์ชันนี้จะถูกเรียกอัตโนมัติเมื่อมีการแนบ Token มากับ Request
  async validate(payload: any) {
    return { id: payload.sub, username: payload.username, role: payload.role, name: payload.name };
  }
}