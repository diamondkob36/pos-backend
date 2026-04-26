import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  // 1. ฟังก์ชันดึงสินค้า (ของเดิม)
  async getProducts() {
    return this.prisma.product.findMany();
  }

  // 2. ฟังก์ชันใหม่! สร้างบิลสั่งซื้อ 🛒
  async createOrder(items: { 
    productId: number; 
    quantity: number; 
    price: number;
    size?: string;      // 🌟 รับค่าไซส์
    toppings?: string;  // 🌟 รับค่าท็อปปิ้ง
    note?: string;      // 🌟 รับค่าคอมเมนต์
  }[]) {
    
    // ก. คำนวณยอดรวมทั้งหมด (ใช้ price ที่ส่งมาจากหน้าบ้าน เพราะรวมค่าท็อปปิ้งมาแล้ว)
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const lastOrderToday = await this.prisma.order.findFirst({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { dailyNumber: 'desc' },
    });

    const newDailyNumber = lastOrderToday ? lastOrderToday.dailyNumber + 1 : 1;

    // ข. สั่ง Prisma บันทึกข้อมูล
    const newOrder = await this.prisma.order.create({
      data: {
        dailyNumber: newDailyNumber,
        totalAmount: totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,       // 🌟 บันทึกราคาที่บวกท็อปปิ้งแล้ว
            size: item.size || null,
            toppings: item.toppings || null,
            note: item.note || null,
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

  // 1. สร้างสินค้าใหม่ (เพิ่ม category)
  async createProduct(data: { name: string; price: number; image: string; category?: string }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        image: data.image,
        category: data.category || 'beverage', // ถ้าไม่ส่งมาให้ถือเป็นเครื่องดื่ม
      },
    });
  }

  // 2. แก้ไขสินค้า (เพิ่ม category)
  async updateProduct(id: number, data: { name?: string; price?: number; image?: string; category?: string }) {
    return this.prisma.product.update({
      where: { id: id },
      data: data,
    });
  }

  // 3. ลบสินค้า 
  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }

  // ==========================================
  // 🌟 ระบบ Admin: จัดการท็อปปิ้ง (Topping CRUD)
  // ==========================================
  async getToppings() {
    return this.prisma.topping.findMany();
  }

  // 🌟 รองรับ image
  async createTopping(data: { name: string; price: number; category: string; image?: string }) {
    return this.prisma.topping.create({ data });
  }

  // 🌟 เพิ่มฟังก์ชันแก้ไข (Update)
  async updateTopping(id: number, data: { name?: string; price?: number; category?: string; image?: string }) {
    return this.prisma.topping.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteTopping(id: number) {
    return this.prisma.topping.delete({ where: { id } });
  }

  // ==========================================
  // 🌟 ระบบ Admin: จัดการหมวดหมู่ (Category CRUD)
  // ==========================================
  async getCategories() {
    return this.prisma.category.findMany();
  }

  async createCategory(data: { value: string; label: string; hasType: boolean; hasSize: boolean }) {
    return this.prisma.category.create({ data });
  }

  async updateCategory(id: number, data: { value?: string; label?: string; hasType?: boolean; hasSize?: boolean }) {
    return this.prisma.category.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteCategory(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }

  // ==========================================
  // 🌟 ระบบเข้าสู่ระบบ (Login)
  // ==========================================
  async login(data: { username: string; password: string }) {
    // 💡 ท่าไม้ตาย: ถ้าเพิ่งเปิดระบบครั้งแรก และยังไม่มี User เลย ให้สร้างไอดีพื้นฐานให้ 2 อันอัตโนมัติ
    const userCount = await this.prisma.user.count();
    if (userCount === 0) {
      await this.prisma.user.create({ data: { username: 'diamondkob36', password: 'diamondth', role: 'manager', name: 'ผู้จัดการร้าน' } });
      await this.prisma.user.create({ data: { username: 'user', password: '123', role: 'cashier', name: 'พนักงานหน้าร้าน' } });
    }

    // ค้นหาพนักงานจาก username
    const user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    // ถ้าไม่เจอ หรือรหัสผิด
    if (!user || user.password !== data.password) {
      return { success: false, message: 'รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง ❌' };
    }

    // ถ้าผ่าน ส่งข้อมูลพนักงานกลับไป (แต่ไม่ส่งรหัสผ่านกลับไปนะ เพื่อความปลอดภัย)
    return { 
      success: true, 
      user: { id: user.id, username: user.username, role: user.role, name: user.name } 
    };
  }

  // ==========================================
  // 🌟 ระบบจัดการพนักงาน (User Management)
  // ==========================================
  async getUsers() {
    // ดึงข้อมูลพนักงานทั้งหมด (แต่ไม่ดึงรหัสผ่านเพื่อความปลอดภัย)
    return this.prisma.user.findMany({
      select: { id: true, username: true, role: true, name: true }
    });
  }

  async createUser(data: { username: string; password: string; role: string; name: string }) {
    // 🌟 เข้ารหัสผ่านก่อนบันทึก
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.create({ data });
  }

  async updateUser(id: number, data: { username?: string; password?: string; role?: string; name?: string }) {
    // ถ้ารหัสผ่านว่างเปล่า (ไม่ได้แก้) ให้ตัดทิ้ง จะได้ไม่อัปเดตทับของเก่า
    if (!data.password) {
      delete data.password;
    } else {
      // 🌟 แต่ถ้ามีการส่งรหัสผ่านใหม่มา ให้เข้ารหัสก่อนบันทึกทับ
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({ where: { id: id }, data });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}