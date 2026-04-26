import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      
      // 🌟 เติม `as string` ต่อท้าย หรือใส่ `|| 'สำรอง'` ไว้เพื่อการันตีว่าเป็นตัวหนังสือแน่นอน
      secretOrKey: configService.get<string>('JWT_SECRET') as string, 
      
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username, role: payload.role, name: payload.name };
  }
}