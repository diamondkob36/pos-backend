# 🚦 Rate Limiting Configuration

## ภาพรวม

ระบบใช้ `@nestjs/throttler` เพื่อจำกัดจำนวน requests ป้องกัน:
- 🛡️ **Brute Force Attack**: ลอง Login หลายครั้ง
- 🛡️ **DDoS Attack**: ส่ง requests จำนวนมากพร้อมกัน
- 🛡️ **API Abuse**: ใช้งาน API มากเกินไป
- 🛡️ **Duplicate Orders**: สร้างบิลซ้ำโดยไม่ตั้งใจ

---

## 📊 Rate Limit ตาม Endpoint

### 🔐 Authentication

| Endpoint | Method | Limit | เหตุผล |
|----------|--------|-------|--------|
| `/auth/login` | POST | **5 ครั้ง/นาที** | ป้องกัน Brute Force Attack |

**ตัวอย่าง**: ถ้าใส่รหัสผ่านผิด 5 ครั้งภายใน 1 นาที จะถูกบล็อก 1 นาที

---

### 🛍️ Products (สินค้า)

| Endpoint | Method | Limit | เหตุผล |
|----------|--------|-------|--------|
| `GET /products` | GET | **ไม่จำกัด** | อ่านข้อมูลบ่อย ไม่เสี่ยง |
| `POST /products` | POST | **20 ครั้ง/นาที** | สร้างสินค้าไม่บ่อย |
| `PUT /products/:id` | PUT | **30 ครั้ง/นาที** | แก้ไขสินค้าบ่อยกว่า |
| `DELETE /products/:id` | DELETE | **10 ครั้ง/นาที** | ลบต้องระวัง |

---

### 🧾 Orders (บิลขาย)

| Endpoint | Method | Limit | เหตุผล |
|----------|--------|-------|--------|
| `POST /orders` | POST | **5 ครั้ง/วินาที** | ป้องกันสร้างบิลซ้ำ |
| `GET /orders` | GET | **10 ครั้ง/10 วินาที** | ดูรายงานไม่บ่อยมาก |

**ตัวอย่าง**: ถ้ากดชำระเงินเร็วเกิน 5 ครั้งใน 1 วินาที จะถูกบล็อก

---

### 🍰 Toppings (ท็อปปิ้ง)

| Endpoint | Method | Limit | เหตุผล |
|----------|--------|-------|--------|
| `GET /toppings` | GET | **ไม่จำกัด** | อ่านข้อมูลบ่อย ไม่เสี่ยง |
| `POST /toppings` | POST | **20 ครั้ง/นาที** | สร้างท็อปปิ้งไม่บ่อย |
| `PUT /toppings/:id` | PUT | **30 ครั้ง/นาที** | แก้ไขท็อปปิ้งบ่อยกว่า |
| `DELETE /toppings/:id` | DELETE | **10 ครั้ง/นาที** | ลบต้องระวัง |

---

### 📂 Categories (หมวดหมู่)

| Endpoint | Method | Limit | เหตุผล |
|----------|--------|-------|--------|
| `GET /categories` | GET | **ไม่จำกัด** | อ่านข้อมูลบ่อย ไม่เสี่ยง |
| `POST /categories` | POST | **10 ครั้ง/นาที** | สร้างหมวดหมู่น้อยมาก |
| `PUT /categories/:id` | PUT | **20 ครั้ง/นาที** | แก้ไขหมวดหมู่บ้าง |
| `DELETE /categories/:id` | DELETE | **5 ครั้ง/นาที** | ลบต้องระวังมาก |

---

### 👥 Users (ผู้ใช้งาน)

| Endpoint | Method | Limit | เหตุผล |
|----------|--------|-------|--------|
| `GET /users` | GET | **5 ครั้ง/10 วินาที** | ข้อมูลสำคัญ ไม่ควรดูบ่อย |
| `POST /users` | POST | **5 ครั้ง/นาที** | สร้าง User ต้องระวัง |
| `PUT /users/:id` | PUT | **10 ครั้ง/นาที** | แก้ไข User ต้องระวัง |
| `DELETE /users/:id` | DELETE | **3 ครั้ง/นาที** | ลบ User ต้องระวังมากที่สุด |

---

## 🎯 Global Rate Limits

นอกจาก Rate Limit แต่ละ endpoint แล้ว ยังมี Global Limits:

| ชื่อ | ระยะเวลา | จำนวน | เหตุผล |
|------|----------|--------|--------|
| **short** | 1 วินาที | 10 requests | ป้องกัน Spam |
| **medium** | 10 วินาที | 50 requests | ป้องกันใช้งานมากเกินไป |
| **long** | 1 นาที | 200 requests | ป้องกัน DDoS |

---

## 🚨 Error Response

เมื่อเกิน Rate Limit จะได้ HTTP Status **429 Too Many Requests**:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

**Response Headers**:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640000000
Retry-After: 60
```

---

## 🔧 การปรับแต่ง

### เปลี่ยน Global Limits

แก้ไขใน `src/app.module.ts`:

```typescript
ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1000,      // เวลา (milliseconds)
    limit: 10,      // จำนวน requests
  },
  // ...
])
```

### เปลี่ยน Endpoint-Specific Limits

แก้ไขใน Controller:

```typescript
@Throttle({ short: { ttl: 60000, limit: 5 } })
@Post('login')
async login() { ... }
```

### ปิด Rate Limit สำหรับ Endpoint

```typescript
@SkipThrottle()
@Get('products')
async getProducts() { ... }
```

---

## 📈 Monitoring

### ตรวจสอบ Rate Limit Hits

ดูใน logs:
```bash
npm run start:dev
# จะเห็น ThrottlerException เมื่อเกิน limit
```

### ทดสอบ Rate Limiting

```bash
# ทดสอบ Login (5 ครั้ง/นาที)
for i in {1..10}; do
  curl -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}'
  echo ""
done

# ครั้งที่ 6 จะได้ 429 Too Many Requests
```

---

## 🎓 Best Practices

### ✅ ควรทำ

1. **GET Endpoints**: ไม่จำกัดหรือจำกัดน้อย (อ่านข้อมูลไม่เสี่ยง)
2. **POST/PUT**: จำกัดปานกลาง (เขียนข้อมูลต้องระวัง)
3. **DELETE**: จำกัดเข้มงวด (ลบข้อมูลต้องระวังมาก)
4. **Login**: จำกัดเข้มงวดมาก (ป้องกัน Brute Force)

### ❌ ไม่ควรทำ

1. ❌ จำกัด GET endpoints มากเกินไป (ทำให้ UX แย่)
2. ❌ ไม่จำกัด Login endpoint (เสี่ยง Brute Force)
3. ❌ ไม่จำกัด Create Order (เสี่ยงสร้างบิลซ้ำ)
4. ❌ ตั้ง limit ต่ำเกินไป (ผู้ใช้ปกติโดนบล็อก)

---

## 🔍 Troubleshooting

### ปัญหา: ผู้ใช้ปกติโดนบล็อก

**สาเหตุ**: Limit ต่ำเกินไป

**แก้ไข**: เพิ่ม limit หรือ ttl

```typescript
// ก่อน
@Throttle({ short: { ttl: 60000, limit: 5 } })

// หลัง
@Throttle({ short: { ttl: 60000, limit: 10 } })
```

### ปัญหา: Rate Limiting ไม่ทำงาน

**สาเหตุ**: ลืมเพิ่ม ThrottlerGuard

**แก้ไข**: ตรวจสอบ `app.module.ts`:

```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
]
```

### ปัญหา: ทุก Request โดนบล็อก

**สาเหตุ**: Global limit ต่ำเกินไป

**แก้ไข**: เพิ่ม Global limit หรือใช้ `@SkipThrottle()`

---

## 📚 Resources

- [NestJS Throttler Docs](https://docs.nestjs.com/security/rate-limiting)
- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)

---

## 🎯 Summary

| ระดับความสำคัญ | Endpoint | Limit |
|----------------|----------|-------|
| 🔴 **สูงสุด** | Login, Delete User | 3-5 ครั้ง/นาที |
| 🟡 **สูง** | Create Order, Create User | 5-10 ครั้ง/นาที |
| 🟢 **ปานกลาง** | Create/Update Products | 20-30 ครั้ง/นาที |
| ⚪ **ต่ำ** | GET Products, Toppings | ไม่จำกัด |

**หมายเหตุ**: ค่าเหล่านี้สามารถปรับแต่งได้ตามการใช้งานจริง
