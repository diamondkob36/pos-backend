#!/usr/bin/env node

/**
 * สคริปต์ทดสอบ Rate Limiting
 * 
 * วิธีใช้:
 * 1. เปิด Backend: npm run start:dev
 * 2. รันสคริปต์: node test-rate-limit.js
 */

const API_URL = 'http://localhost:3001';

console.log('\n🧪 Rate Limiting Test\n');
console.log('━'.repeat(80));

// ทดสอบ Login Rate Limit (5 ครั้ง/นาที)
async function testLoginRateLimit() {
  console.log('\n📝 Test 1: Login Rate Limit (5 ครั้ง/นาที)\n');
  
  for (let i = 1; i <= 7; i++) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: 'test' })
      });
      
      const status = response.status;
      const statusText = response.statusText;
      
      if (status === 429) {
        console.log(`   ❌ Request ${i}: ${status} ${statusText} - ถูกบล็อก! ✅`);
      } else {
        console.log(`   ✅ Request ${i}: ${status} ${statusText}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Request ${i}: Error - ${error.message}`);
    }
    
    // รอ 100ms ระหว่าง request
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// ทดสอบ Create Order Rate Limit (5 ครั้ง/วินาที)
async function testOrderRateLimit() {
  console.log('\n📝 Test 2: Create Order Rate Limit (5 ครั้ง/วินาที)\n');
  console.log('   ⚠️  ต้องมี Token ที่ถูกต้องถึงจะทดสอบได้\n');
  
  // ต้องมี token จริงถึงจะทดสอบได้
  console.log('   💡 วิธีทดสอบ:');
  console.log('   1. Login ผ่าน Frontend');
  console.log('   2. เปิด DevTools → Application → localStorage');
  console.log('   3. คัดลอก pos_token');
  console.log('   4. แก้ไขสคริปต์นี้ใส่ token');
}

// รันการทดสอบ
async function runTests() {
  console.log('\n🚀 เริ่มทดสอบ Rate Limiting...\n');
  
  await testLoginRateLimit();
  await testOrderRateLimit();
  
  console.log('\n━'.repeat(80));
  console.log('\n✅ ทดสอบเสร็จสิ้น!\n');
  console.log('📊 ผลการทดสอบ:');
  console.log('   - Request ที่ 1-5: ควรผ่าน (200 หรือ 401)');
  console.log('   - Request ที่ 6-7: ควรถูกบล็อก (429 Too Many Requests)');
  console.log('\n💡 ถ้าเห็น 429 แสดงว่า Rate Limiting ทำงานถูกต้อง!\n');
}

// ตรวจสอบว่า Backend รันอยู่หรือไม่
async function checkBackend() {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: { 'Authorization': 'Bearer invalid' }
    });
    return true;
  } catch (error) {
    console.log('\n❌ ไม่สามารถเชื่อมต่อ Backend ได้!\n');
    console.log('   กรุณาเปิด Backend ก่อน:');
    console.log('   cd pos-backend && npm run start:dev\n');
    return false;
  }
}

// Main
(async () => {
  const isBackendRunning = await checkBackend();
  if (isBackendRunning) {
    await runTests();
  }
})();
