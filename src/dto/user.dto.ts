import { IsString, IsNotEmpty, IsOptional, IsBoolean, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผู้ใช้งาน' })
  @MinLength(3, { message: 'รหัสผู้ใช้งานต้องมีอย่างน้อย 3 ตัวอักษร' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
  @MinLength(4, { message: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุสิทธิ์การใช้งาน' })
  @IsIn(['manager', 'cashier', 'supervisor'], { message: 'สิทธิ์ไม่ถูกต้อง' })
  role: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อพนักงาน' })
  name: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'รหัสผู้ใช้งานต้องมีอย่างน้อย 3 ตัวอักษร' })
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' })
  password?: string;

  @IsString()
  @IsOptional()
  @IsIn(['manager', 'cashier', 'supervisor'], { message: 'สิทธิ์ไม่ถูกต้อง' })
  role?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
