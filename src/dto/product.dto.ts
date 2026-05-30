import { IsString, IsNumber, IsNotEmpty, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อสินค้า' })
  name: string;

  @IsNumber()
  @Min(0, { message: 'ราคาต้องมากกว่าหรือเท่ากับ 0' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุรูปภาพ' })
  image: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'ราคาต้องมากกว่าหรือเท่ากับ 0' })
  price?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
