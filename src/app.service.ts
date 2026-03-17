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

    // ข. สั่ง Prisma บันทึกข้อมูลลง 2 ตารางพร้อมกัน (Order + OrderItem)
    const newOrder = await this.prisma.order.create({
      data: {
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
}