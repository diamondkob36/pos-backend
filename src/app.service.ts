import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getProducts() {
    return this.prisma.product.findMany();
  }

  async createOrder(items: { 
    productId: number; 
    quantity: number; 
    price: number;
    size?: string;
    toppings?: string;
    note?: string;
  }[]) {
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

    const newOrder = await this.prisma.order.create({
      data: {
        dailyNumber: newDailyNumber,
        totalAmount: totalAmount,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
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
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
  
  // Products CRUD
  async createProduct(data: { name: string; price: number; image?: string; category?: string; isAvailable?: boolean; isActive?: boolean }) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        image: data.image || null,
        category: data.category || 'beverage',
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async updateProduct(id: number, data: { name?: string; price?: number; image?: string; category?: string; isAvailable?: boolean; isActive?: boolean }) {
    return this.prisma.product.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id: id },
    });
  }

  // Toppings CRUD
  async getToppings() {
    return this.prisma.topping.findMany();
  }

  async createTopping(data: { name: string; price: number; category: string; image?: string; isAvailable?: boolean; isActive?: boolean }) {
    return this.prisma.topping.create({ 
      data: {
        name: data.name,
        price: data.price,
        category: data.category,
        image: data.image || null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
  }

  async updateTopping(id: number, data: { name?: string; price?: number; category?: string; image?: string; isAvailable?: boolean; isActive?: boolean }) {
    return this.prisma.topping.update({
      where: { id: id },
      data: data,
    });
  }

  async deleteTopping(id: number) {
    return this.prisma.topping.delete({ where: { id } });
  }

  // Categories CRUD
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
    const categoryToDelete = await this.prisma.category.findUnique({ where: { id } });

    if (!categoryToDelete) {
      throw new BadRequestException('ไม่พบหมวดหมู่นี้ในระบบ');
    }

    const productCount = await this.prisma.product.count({
      where: { category: categoryToDelete.value }
    });

    if (productCount > 0) {
      throw new BadRequestException(`ไม่สามารถลบได้! มีสินค้าค้างอยู่ในหมวดหมู่นี้ ${productCount} เมนู กรุณาย้ายสินค้าก่อนครับ`);
    }

    return this.prisma.category.delete({ where: { id } });
  }

  // Users CRUD
  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, role: true, name: true, isActive: true }
    });
  }

  async createUser(data: { username: string; password: string; role: string; name: string }) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.create({ data });
  }

  async updateUser(id: number, data: { username?: string; password?: string; role?: string; name?: string; isActive?: boolean }) {
    // ถ้าไม่มี password หรือเป็นค่าว่าง ให้ลบออกจาก data
    if (!data.password || data.password.trim() === '') {
      delete data.password;
    } else {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.update({ where: { id: id }, data });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}