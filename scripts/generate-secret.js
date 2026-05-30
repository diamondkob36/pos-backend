#!/usr/bin/env node

/**
 * สคริปต์สำหรับสร้าง JWT Secret Key ที่ปลอดภัย
 * 
 * วิธีใช้:
 * node scripts/generate-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Key Generator\n');
console.log('━'.repeat(80));

const secret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ Secret Key ที่สร้างใหม่:\n');
console.log(secret);
console.log('\n━'.repeat(80));
console.log('\n📝 คัดลอกไปใส่ในไฟล์ .env:\n');
console.log(`JWT_SECRET="${secret}"`);
console.log('\n⚠️  คำเตือน: อย่าแชร์ Secret Key นี้กับใครหรือ commit ลง Git!\n');
