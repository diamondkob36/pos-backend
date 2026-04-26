import { Controller, Get, Post, Body, Put, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ==========================================
  // 🔒 เส้นทางที่ต้องมี Token (Protected)
  // ==========================================

  // --- จัดการสินค้า (Products) ---
  @UseGuards(AuthGuard('jwt'))
  @Get('products')
  async getProducts() {
    return this.appService.getProducts();
  }

  @UseGuards(AuthGuard('jwt'))
 @Post('products')
  async createProduct(@Body() body: { name: string; price: number; image: string; category: string }) {
    return this.appService.createProduct(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('products/:id')
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.appService.updateProduct(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('products/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteProduct(id);
  }

  // --- จัดการบิล/ยอดขาย (Orders) ---
  @UseGuards(AuthGuard('jwt'))
  @Post('orders')
  async createOrder(@Body() body: { items: any[] }) {
    return this.appService.createOrder(body.items);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('orders')
  async getOrders() {
    return this.appService.getOrders();
  }

  // --- จัดการท็อปปิ้ง (Toppings) ---
  @UseGuards(AuthGuard('jwt'))
  @Get('toppings')
  getToppings() {
    return this.appService.getToppings();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('toppings')
  createTopping(@Body() body: { name: string; price: number; category: string; image?: string }) {
    return this.appService.createTopping(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('toppings/:id')
  updateTopping(@Param('id') id: string, @Body() body: { name?: string; price?: number; category?: string; image?: string }) {
    return this.appService.updateTopping(Number(id), body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('toppings/:id')
  deleteTopping(@Param('id') id: string) {
    return this.appService.deleteTopping(Number(id));
  }

  // --- จัดการหมวดหมู่ (Categories) ---
  @UseGuards(AuthGuard('jwt'))
  @Get('categories')
  getCategories() {
    return this.appService.getCategories();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('categories')
  createCategory(@Body() body: { value: string; label: string; hasType: boolean; hasSize: boolean }) {
    return this.appService.createCategory(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: { value?: string; label?: string; hasType?: boolean; hasSize?: boolean }) {
    return this.appService.updateCategory(Number(id), body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.appService.deleteCategory(Number(id));
  }

  // --- จัดการบัญชีพนักงาน (Users) ---
  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  getUsers() { return this.appService.getUsers(); }

  @UseGuards(AuthGuard('jwt'))
  @Post('users')
  createUser(@Body() body: any) { return this.appService.createUser(body); }

  @UseGuards(AuthGuard('jwt'))
  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() body: any) { return this.appService.updateUser(Number(id), body); }

  @UseGuards(AuthGuard('jwt'))
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) { return this.appService.deleteUser(Number(id)); }
}