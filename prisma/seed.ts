import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // สั่งให้ระบบไปอ่านไฟล์ .env เพื่อดึงรหัสผ่าน

// ตั้งค่าการเชื่อมต่อแบบใหม่สำหรับ Prisma 7.5.0+
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('กำลังเริ่มหยอดข้อมูล...');

  // 1. ล้างข้อมูลเก่าออกก่อน (ถ้ามี) เพื่อป้องกันข้อมูลซ้ำซ้อน
  await prisma.product.deleteMany();
  console.log('ล้างข้อมูลเก่าเรียบร้อย');

  // 2. เพิ่มสินค้าเริ่มต้น 4 รายการ
  await prisma.product.createMany({
    data: [
      { name: "อเมริกาโน่เย็น", price: 60, image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80" },
      { name: "ชาเขียวมัทฉะ", price: 70, image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&q=80" },
      { name: "ครัวซองต์เนยสด", price: 55, image: "https://images.unsplash.com/photo-1549903072-7e6e0d2390eb?w=500&q=80" },
      { name: "เค้กช็อกโกแลต", price: 85, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80" },
    ],
  });
  
  console.log('Seed data success! 🌱');
}

main()
  .catch((e) => {
    console.error('เกิดข้อผิดพลาด:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });