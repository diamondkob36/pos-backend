import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // สั่งให้ไปอ่านรหัสผ่านจาก .env

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. เตรียมตัวเชื่อมต่อแบบเดียวกับตอนที่เราทำ Seed
    const connectionString = `${process.env.DATABASE_URL}`;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool as any);
    
    // 2. ส่ง Adapter เข้าไปให้ PrismaClient ตัวแม่ใช้งาน
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}