import { Controller, Get, Post, Body, Put, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Products
  @Get('products')
  @SkipThrottle()
  async getProducts() {
    return this.appService.getProducts();
  }

  @Post('products')
  @Roles('manager', 'supervisor')
  @Throttle({ short: { ttl: 60000, limit: 20 } })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.appService.createProduct(createProductDto);
  }

  @Put('products/:id')
  @Roles('manager', 'supervisor')
  @Throttle({ short: { ttl: 60000, limit: 30 } })
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.appService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  @Roles('manager')
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteProduct(id);
  }

  // Orders
  @Post('orders')
  @Throttle({ short: { ttl: 1000, limit: 5 } })
  async createOrder(@Body() body: { items: any[] }) {
    return this.appService.createOrder(body.items);
  }

  @Get('orders')
  @Roles('manager', 'supervisor')
  @Throttle({ short: { ttl: 10000, limit: 10 } })
  async getOrders() {
    return this.appService.getOrders();
  }

  // Toppings
  @Get('toppings')
  @SkipThrottle()
  getToppings() {
    return this.appService.getToppings();
  }

  @Post('toppings')
  @Roles('manager', 'supervisor')
  @Throttle({ short: { ttl: 60000, limit: 20 } })
  createTopping(@Body() body: { name: string; price: number; category: string; image?: string; isAvailable?: boolean; isActive?: boolean }) {
    return this.appService.createTopping(body);
  }

  @Put('toppings/:id')
  @Roles('manager', 'supervisor')
  @Throttle({ short: { ttl: 60000, limit: 30 } })
  updateTopping(@Param('id') id: string, @Body() body: { name?: string; price?: number; category?: string; image?: string; isAvailable?: boolean; isActive?: boolean }) {
    return this.appService.updateTopping(Number(id), body);
  }

  @Delete('toppings/:id')
  @Roles('manager')
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  deleteTopping(@Param('id') id: string) {
    return this.appService.deleteTopping(Number(id));
  }

  // Categories
  @Get('categories')
  @SkipThrottle()
  getCategories() {
    return this.appService.getCategories();
  }

  @Post('categories')
  @Roles('manager', 'supervisor')
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  createCategory(@Body() body: { value: string; label: string; hasType: boolean; hasSize: boolean }) {
    return this.appService.createCategory(body);
  }

  @Put('categories/:id')
  @Roles('manager', 'supervisor')
  @Throttle({ short: { ttl: 60000, limit: 20 } })
  updateCategory(@Param('id') id: string, @Body() body: { value?: string; label?: string; hasType?: boolean; hasSize?: boolean }) {
    return this.appService.updateCategory(Number(id), body);
  }

  @Delete('categories/:id')
  @Roles('manager')
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  deleteCategory(@Param('id') id: string) {
    return this.appService.deleteCategory(Number(id));
  }

  // Users
  @Get('users')
  @Roles('manager')
  @Throttle({ short: { ttl: 10000, limit: 5 } })
  getUsers() { 
    return this.appService.getUsers(); 
  }

  @Post('users')
  @Roles('manager')
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  createUser(@Body() createUserDto: CreateUserDto) { 
    return this.appService.createUser(createUserDto); 
  }

  @Put('users/:id')
  @Roles('manager')
  @Throttle({ short: { ttl: 60000, limit: 10 } })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) { 
    return this.appService.updateUser(Number(id), updateUserDto); 
  }

  @Delete('users/:id')
  @Roles('manager')
  @Throttle({ short: { ttl: 60000, limit: 3 } })
  deleteUser(@Param('id') id: string) { 
    return this.appService.deleteUser(Number(id)); 
  }
}