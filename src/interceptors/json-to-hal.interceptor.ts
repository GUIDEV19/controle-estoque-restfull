import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormatHalService } from 'src/common/services/formatHal.service';
import { XMLBuilder } from 'fast-xml-parser';

@Injectable()
export class JsonToHalInterceptor implements NestInterceptor {
  constructor(private readonly formatHalService: FormatHalService) {}
  private readonly supportedContentTypes = [
    'application/json',
    'application/hal+json',
    'application/xml'
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
      return next.handle().pipe(
        map((data) => {
          delete data._links;
          return data;
        })
      );
    }

    if(contentType === 'application/xml') {
      return next.handle().pipe(
        map((data) => {
          const builder = new XMLBuilder({
            ignoreAttributes: false,
            format: true,
            indentBy: '  '
          });
          return builder.build({ response: data });
        })
      );
    }

    return next.handle().pipe(
      map((data) => {
        return this.formatHalService.formatHal(data, {
          self: { href: request.url },
          ...data?._links
        });
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
} 