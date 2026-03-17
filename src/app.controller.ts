import { Controller, Get, Post, Body } from '@nestjs/common';
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
}