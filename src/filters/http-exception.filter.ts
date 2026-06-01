import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Global Exception Filter
 * จัดการ Error ทั้งหมดในระบบ โดยเฉพาะ JWT Expired
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      }
    } else if (exception instanceof Error) {
      // จัดการ JWT Expired Error
      if (exception.name === 'TokenExpiredError') {
        status = HttpStatus.UNAUTHORIZED;
        message = 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่';
        error = 'Token Expired';
        
        // เพิ่ม Header บอกว่า Token หมดอายุ
        response.setHeader('X-Token-Expired', 'true');
      } else if (exception.name === 'JsonWebTokenError') {
        status = HttpStatus.UNAUTHORIZED;
        message = 'Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่';
        error = 'Invalid Token';
      } else {
        message = exception.message;
      }
    }

    // Log error สำหรับ debugging
    if (status >= 500) {
      console.error('Server Error:', exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
