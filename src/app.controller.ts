import { Controller, Get, Post, Body, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('products')
  async getProducts() {
    return this.appService.getProducts();
  }

  // 🌟 จุดสำคัญ: ต้องมีคำว่า return เพื่อส่งข้อมูลบิลกลับไปให้หน้าเว็บ
  @Post('orders')
  async createOrder(@Body() body: { items: any[] }) {
    return this.appService.createOrder(body.items);
  }

  @Get('orders')
  async getOrders() {
    return this.appService.getOrders();
  }

  @Post('products')
  async createProduct(@Body() body: { name: string; price: number; image: string }) {
    return this.appService.createProduct(body);
  }

  @Put('products/:id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.appService.updateProduct(id, body);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteProduct(id);
  }

  // ==========================================
  // 🌟 API จัดการท็อปปิ้ง
  // ==========================================
  @Get('toppings')
  getToppings() {
    return this.appService.getToppings();
  }

  @Post('toppings')
  createTopping(@Body() body: { name: string; price: number; category: string; image?: string }) {
    return this.appService.createTopping(body);
  }

  // 🌟 เพิ่ม API เส้นนี้สำหรับแก้ไข (Edit)
  @Put('toppings/:id')
  updateTopping(@Param('id') id: string, @Body() body: { name?: string; price?: number; category?: string; image?: string }) {
    return this.appService.updateTopping(Number(id), body);
  }

  @Delete('toppings/:id')
  deleteTopping(@Param('id') id: string) {
    return this.appService.deleteTopping(Number(id));
  }

  // ==========================================
  // 🌟 API จัดการหมวดหมู่ (Category)
  // ==========================================
  @Get('categories')
  getCategories() {
    return this.appService.getCategories();
  }

  @Post('categories')
  createCategory(@Body() body: { value: string; label: string; hasType: boolean; hasSize: boolean }) {
    return this.appService.createCategory(body);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: { value?: string; label?: string; hasType?: boolean; hasSize?: boolean }) {
    return this.appService.updateCategory(Number(id), body);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.appService.deleteCategory(Number(id));
  }

  // 🌟 เส้นทางสำหรับ Login
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.appService.login(body);
  }

  // 🌟 API จัดการพนักงาน
  @Get('users')
  getUsers() { return this.appService.getUsers(); }

  @Post('users')
  createUser(@Body() body: any) { return this.appService.createUser(body); }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() body: any) { return this.appService.updateUser(Number(id), body); }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) { return this.appService.deleteUser(Number(id)); }
}  