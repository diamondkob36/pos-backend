import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  // 1. ฟังก์ชันดึงสินค้า (ของเดิม)
  async getProducts() {
    return this.prisma.product.findMany();
  }

  // 2. ฟังก์ชันใหม่! สร้างบิลสั่งซื้อ 🛒
  // สมมติว่าหน้าบ้านจะส่งข้อมูลมาเป็น array ของสินค้า เช่น [{ productId: 1, quantity: 2, price: 60 }]
  async createOrder(items: { productId: number; quantity: number; price: number }[]) {
    
    // ก. คำนวณยอดรวมทั้งหมด (Total Amount)
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 🌟 🌟 🌟 เพิ่มระบบคำนวณเลขบิลประจำวัน 🌟 🌟 🌟
    // 1. หาวันที่ปัจจุบัน (ตั้งเวลาให้เป็น 00:00:00 - 23:59:59 ของวันนี้)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 2. ค้นหาบิลล่าสุดของ "วันนี้" ในฐานข้อมูล
    const lastOrderToday = await this.prisma.order.findFirst({
      where: {
        createdAt: {
          gte: startOfDay, // มากกว่าหรือเท่ากับ เวลาเริ่มต้นของวัน
          lte: endOfDay,   // น้อยกว่าหรือเท่ากับ เวลาสิ้นสุดของวัน
        },
      },
      orderBy: {
        dailyNumber: 'desc', // เรียงจากเลขคิวมากสุดไปน้อยสุด เพื่อเอาตัวบนสุด
      },
    });

    // 3. กำหนดเลขคิวใหม่ (ถ้ามีบิลแล้วให้เอาเลขล่าสุด + 1, ถ้ายังไม่มีให้เริ่มที่ 1)
    const newDailyNumber = lastOrderToday ? lastOrderToday.dailyNumber + 1 : 1;
    // 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟 🌟

    // ข. สั่ง Prisma บันทึกข้อมูลลง 2 ตารางพร้อมกัน (Order + OrderItem)
    const newOrder = await this.prisma.order.create({
      data: {
        dailyNumber: newDailyNumber, // 🌟 บันทึกเลขบิลประจำวันลงไปด้วย
        totalAmount: totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    return newOrder;
  }

  async getOrders() {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc', // เรียงลำดับวันที่ จากใหม่สุด (descending) ไปเก่าสุด
      },
      include: {
        items: {
          include: {
            product: true, // ดึงข้อมูลชื่อสินค้า/รูปภาพ จากตาราง Product มาด้วย
          },
        },
      },
    });
  }
  
  // ==========================================
  // 🌟 ระบบ Admin: จัดการสินค้า (CRUD)
  // ==========================================

  // 1. สร้างสินค้าใหม่ (Create)
  async createProduct(data: { name: string; price: number; image: string }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        image: data.image,
      },
    });
  }

  // 2. แก้ไขสินค้า (Update)
  async updateProduct(id: number, data: { name?: string; price?: number; image?: string }) {
    return this.prisma.product.update({
      where: { id: id },
      data: data,
    });
  }

  // 3. ลบสินค้า (Delete)
  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }
}