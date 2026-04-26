import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; 

// 1. ตั้งค่าการเชื่อมต่อ (ต้องใช้ Adapter สำหรับ Prisma 7+ ในโปรเจคนี้)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- เริ่มต้นการ Seed ข้อมูล ---');

  // 2. ล้างข้อมูลเก่า (ป้องกัน Relation Error)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.topping.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ ล้างข้อมูลเก่าสำเร็จ');

  // 3. สร้างบัญชี Manager: diamondkob36
  const hashedPassword = await bcrypt.hash('diamondth', 10);
  await prisma.user.create({
    data: {
      username: 'diamondkob36',
      password: hashedPassword,
      name: 'ผู้จัดการ',
      role: 'manager',
    },
  });
  console.log('✅ สร้าง User: diamondkob36 สำเร็จ');

  // 4. เพิ่มหมวดหมู่เริ่มต้น (ป้องกันหน้าบ้านเชื่อมต่อล้มเหลวเพราะไม่มีข้อมูล)
  await prisma.category.createMany({
    data: [
      { value: 'coffee', label: 'กาแฟ', hasType: true, hasSize: true },
      { value: 'bakery', label: 'เบเกอรี่', hasType: false, hasSize: false },
    ],
  });
  console.log('✅ เพิ่มหมวดหมู่สำเร็จ');
}

main()
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // 🌟 ส่วนสำคัญ: ต้องปิดทั้ง Prisma และ Pool เพื่อไม่ให้ติด Error ตอนจบ
    await prisma.$disconnect();
    await pool.end(); 
    console.log('--- 🌱 Seed Success & Connection Closed ---');
  });