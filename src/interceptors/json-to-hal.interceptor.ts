import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class JsonToHalInterceptor implements NestInterceptor {
  private readonly supportedContentTypes = [
    'application/json',
    'application/hal+json'
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const acceptHeader = request.headers.accept || 'application/json';

    if(request.method === 'OPTIONS') {
      return next.handle();
    }

    const contentType = this.getContentType(acceptHeader);
    if (!contentType) {
      response.status(406).json({
        error: 'Not Acceptable',
        message: 'The requested content type is not supported',
        status: 406,
        supportedTypes: this.supportedContentTypes
      });
      return of(null);
    }

    response.setHeader('Content-Type', contentType);

    if (contentType === 'application/json') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return this.transformToHal(data, request.url)
      })
    );
  }

  private getContentType(acceptHeader: string): string | null {
    const types = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
    
    for (const type of types) {
      if (this.supportedContentTypes.includes(type)) {
        return type;
      }
    }

    return null;
  }

  private transformToHal(data: any, baseUrl: string): any {
    if (data && data._links) {
      return data;
    }

    if (Array.isArray(data)) {
      return {
        _links: {
          self: { href: baseUrl }
        },
        _embedded: {
          items: data.map(item => ({
            ...item,
            _links: {
              self: { href: `${baseUrl}/${item.id || item.idEntity}` } //Problema: não vai funcionar para outras entidades
            }
          }))
        }
      };
    }

    if (data && typeof data === 'object') {
      return {
        _links: {
          self: { href: baseUrl }
        },
        ...data //Problema: Vai ficar faltando o _embedded
      };
    }

    return {
      _links: {
        self: { href: baseUrl }
      },
      data
    };
  }
} 