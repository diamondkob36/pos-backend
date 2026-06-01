# 🔧 POS Backend API

Backend API สำหรับระบบ POS (Point of Sale) ใช้ NestJS + Prisma + PostgreSQL

## 🛠️ เทคโนโลยี

- **NestJS 11** - Node.js Framework แบบ Modular
- **Prisma 7** - ORM สำหรับจัดการ Database
- **PostgreSQL** - Relational Database
- **Passport JWT** - Authentication Strategy
- **bcrypt** - Password Hashing
- **TypeScript** - Type Safety

## 🚀 เริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db"
JWT_SECRET="your-secret-key"  # สร้างด้วย: node scripts/generate-secret.js
PORT=3001
```

### 3. ตั้งค่า Database
```bash
npx prisma migrate dev    # สร้างตาราง
npx prisma db seed        # เพิ่มข้อมูลตัวอย่าง
npx prisma generate       # Generate Prisma Client
```

### 4. รัน Backend
```bash
npm run start:dev         # Development (Hot Reload)
npm run start:prod        # Production
```

## 📦 คำสั่งที่ใช้บ่อย

```bash
npm run start:dev         # Development mode
npm run build             # Build TypeScript
npm run start:prod        # Production mode
npx prisma studio         # Database GUI
npx prisma generate       # Generate Client (หลังแก้ schema)
npx prisma migrate dev    # สร้าง Migration
npx prisma db seed        # Seed ข้อมูล
```

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - Login (Public)

### Products
- `GET /products` - ดึงสินค้าทั้งหมด
- `POST /products` - เพิ่มสินค้า (Auth)
- `PUT /products/:id` - แก้ไขสินค้า (Auth)
- `DELETE /products/:id` - ลบสินค้า (Auth)

### Toppings
- `GET /toppings` - ดึงท็อปปิ้งทั้งหมด
- `POST /toppings` - เพิ่มท็อปปิ้ง (Auth)
- `PUT /toppings/:id` - แก้ไขท็อปปิ้ง (Auth)
- `DELETE /toppings/:id` - ลบท็อปปิ้ง (Auth)

### Categories
- `GET /categories` - ดึงหมวดหมู่ทั้งหมด
- `POST /categories` - เพิ่มหมวดหมู่ (Auth)
- `PUT /categories/:id` - แก้ไขหมวดหมู่ (Auth)
- `DELETE /categories/:id` - ลบหมวดหมู่ (Auth)

### Orders
- `GET /orders` - ดึงบิลทั้งหมด (Auth)
- `POST /orders` - สร้างบิลใหม่ (Auth)

### Users
- `GET /users` - ดึงผู้ใช้ทั้งหมด (Manager/Supervisor)
- `POST /users` - เพิ่มผู้ใช้ (Manager/Supervisor)
- `PUT /users/:id` - แก้ไขผู้ใช้ (Manager/Supervisor)
- `DELETE /users/:id` - ลบผู้ใช้ (Manager)

## 🔐 ความปลอดภัย

- **JWT Authentication** พร้อม Auto Logout
- **Password Hashing** ด้วย bcrypt (10 salt rounds)
- **Role-Based Access Control** (Manager, Supervisor, Cashier)
- **Rate Limiting** ป้องกัน Brute Force
  - Login: 5 attempts/minute
  - Create Order: 5 requests/second
  - Delete: 3-10 requests/minute
- **Input Validation** ทุก endpoint
- **SQL Injection Prevention** ด้วย Prisma ORM
- **CORS Configuration** จำกัด origins

### สร้าง JWT Secret
```bash
node scripts/generate-secret.js
# คัดลอก Secret ไปใส่ใน .env
```

## 🆘 แก้ปัญหาที่พบบ่อย

**Port 3001 ถูกใช้งานอยู่**
```bash
netstat -ano | findstr :3001
taskkill /F /PID <pid>
```

**Database Connection Error**
- ตรวจสอบ PostgreSQL รันอยู่หรือไม่
- ตรวจสอบ `DATABASE_URL` ใน `.env`
- Run `npx prisma migrate dev`

**TypeScript Error หลังแก้ Schema**
```bash
npx prisma generate
# Restart Backend
```

## 📝 หมายเหตุ

- หลังแก้ `schema.prisma` ต้อง run `npx prisma generate` และ restart Backend
- ใช้ `npx prisma studio` เพื่อดู/แก้ไขข้อมูลใน Database
- API รันที่ `http://localhost:3001`
- ดูเอกสารเพิ่มเติม: [RATE_LIMITING.md](./RATE_LIMITING.md)
