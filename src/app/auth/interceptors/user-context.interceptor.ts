import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticatedUserDto } from '../../users/dto/user.dto';

export interface RequestWithUser extends Request {
  user: AuthenticatedUserDto;
}

@Injectable()
export class UserContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (request.user) {
      request.userContext = {
        userId: request.user.id,
        userEmail: request.user.email,
        userName: request.user.name,
        timestamp: new Date().toISOString()
      };
    }

    return next.handle().pipe(
      tap(() => {
        if (request.user) {
          console.log(`Request processed by user: ${request.user.email} (ID: ${request.user.id})`);
        } else {
          console.log('Request processed by anonymous user');
        }
      })
    );
  }
} 