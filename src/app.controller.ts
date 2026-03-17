import { Controller, Get, Post, Body, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // API ดึงสินค้า (ของเดิม)
  @Get('products')
  async getProducts() {
    return this.appService.getProducts();
  }

  // API ใหม่! รับข้อมูลบิลสั่งซื้อ (ใช้ POST)
  @Post('orders')
  async createOrder(@Body() body: { items: { productId: number; quantity: number; price: number }[] }) {
    // รับข้อมูลจากหน้าบ้าน แล้วส่งให้ Service ทำงานต่อ
    return this.appService.createOrder(body.items);
  }

  // 🌟 API ใหม่: ดึงข้อมูลประวัติยอดขาย (ใช้ GET)
  @Get('orders')
  async getOrders() {
    return this.appService.getOrders();
  }

  // ==========================================
  // 🌟 API สำหรับระบบ Admin
  // ==========================================

  // 1. API เพิ่มสินค้าใหม่
  @Post('products')
  async createProduct(@Body() body: { name: string; price: number; image: string }) {
    return this.appService.createProduct(body);
  }

  // 2. API แก้ไขสินค้า (ต้องส่ง id ผ่าน URL)
  @Put('products/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number, // ดึง id จาก URL มาแปลงเป็นตัวเลข
    @Body() body: { name?: string; price?: number; image?: string }
  ) {
    return this.appService.updateProduct(id, body);
  }

  // 3. API ลบสินค้า (ต้องส่ง id ผ่าน URL)
  @Delete('products/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteProduct(id);
  }
}