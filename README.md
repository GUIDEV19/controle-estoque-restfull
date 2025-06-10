# API de Controle de Estoque - NestJS RESTFULL

## Validações e Status Codes

### Exceptions HTTP

| Exception | Status Code | Descrição |
|-----------|-------------|-----------|
| `BadRequestException` | 400 | Requisição inválida |
| `UnauthorizedException` | 401 | Não autenticado |
| `ForbiddenException` | 403 | Não autorizado |
| `NotFoundException` | 404 | Recurso não encontrado |
| `MethodNotAllowedException` | 405 | Método não permitido |
| `NotAcceptableException` | 406 | Não aceitável (Content Negotiation) |
| `RequestTimeoutException` | 408 | Timeout na requisição |
| `ConflictException` | 409 | Conflito |
| `GoneException` | 410 | Recurso não disponível |
| `PayloadTooLargeException` | 413 | Payload muito grande |
| `UnsupportedMediaTypeException` | 415 | Tipo de mídia não suportado |
| `UnprocessableEntityException` | 422 | Entidade não processável |
| `InternalServerErrorException` | 500 | Erro interno do servidor |
| `NotImplementedException` | 501 | Não implementado |
| `BadGatewayException` | 502 | Gateway inválido |
| `ServiceUnavailableException` | 503 | Serviço indisponível |
| `GatewayTimeoutException` | 504 | Timeout no gateway |

### Decorators de Validação

| Decorator | Descrição |
|-----------|-----------|
| `@IsString()` | Valida se é uma string |
| `@IsNumber()` | Valida se é um número |
| `@IsBoolean()` | Valida se é um booleano |
| `@IsDate()` | Valida se é uma data |
| `@IsEmail()` | Valida se é um email válido |
| `@IsNotEmpty()` | Valida se não está vazio |
| `@IsOptional()` | Marca o campo como opcional |
| `@MinLength()` | Define tamanho mínimo |
| `@MaxLength()` | Define tamanho máximo |
| `@Length()` | Define tamanho exato |
| `@Min()` | Define valor mínimo |
| `@Max()` | Define valor máximo |
| `@IsArray()` | Valida se é um array |
| `@IsObject()` | Valida se é um objeto |
| `@IsEnum()` | Valida se é um valor do enum |
| `@IsUUID()` | Valida se é um UUID |
| `@IsUrl()` | Valida se é uma URL |
| `@IsPhoneNumber()` | Valida se é um número de telefone |
| `@IsPostalCode()` | Valida se é um código postal |
| `@IsCurrency()` | Valida se é um valor monetário |

### Pipes de Validação

| Pipe | Descrição |
|------|-----------|
| `ValidationPipe` | Valida objetos DTO |
| `ParseIntPipe` | Converte para inteiro |
| `ParseFloatPipe` | Converte para float |
| `ParseBoolPipe` | Converte para booleano |
| `ParseArrayPipe` | Converte para array |
| `ParseUUIDPipe` | Converte para UUID |
| `ParseEnumPipe` | Converte para enum |
| `ParseFilePipe` | Valida arquivos |

### Guards

| Guard | Descrição |
|-------|-----------|
| `AuthGuard` | Protege rotas autenticadas |
| `RolesGuard` | Protege rotas por roles |
| `ThrottlerGuard` | Protege contra rate limiting |

### Interceptors

| Interceptor | Descrição |
|-------------|-----------|
| `HalContentNegotiationInterceptor` | Valida headers de content negotiation |
| `LoggingInterceptor` | Registra logs das requisições |
| `CacheInterceptor` | Implementa cache |
| `TimeoutInterceptor` | Controla timeout das requisições |

### Filtros de Exceção

| Filter | Descrição |
|--------|-----------|
| `HttpExceptionFilter` | Filtro padrão de exceções HTTP |
| `AllExceptionsFilter` | Filtro para todas as exceções |
| `ValidationExceptionFilter` | Filtro específico para exceções de validação |

## Sistema de Logs

A aplicação utiliza o Winston como sistema de logging, implementado através do `CustomLoggerService`. O sistema de logs foi projetado para fornecer informações detalhadas sobre o funcionamento da aplicação.

### Configuração do Logger

O logger está configurado com as seguintes características:
- Formato JSON para logs estruturados
- Timestamp em cada entrada de log
- Níveis de log: error, warn, info, debug, verbose
- Output colorizado no console para melhor visualização

### Uso do Logger

Para utilizar o logger em qualquer serviço, basta injetá-lo no construtor:

```typescript
constructor(
  private readonly logger: CustomLoggerService
) {}
```

### Métodos Disponíveis

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `log()` | Log de informação geral | `logger.log('Operação realizada', 'ServiceName')` |
| `error()` | Log de erros | `logger.error('Erro na operação', error.stack, 'ServiceName')` |
| `warn()` | Log de avisos | `logger.warn('Aviso importante', 'ServiceName')` |
| `debug()` | Log de debug | `logger.debug('Informação de debug', 'ServiceName')` |
| `verbose()` | Log detalhado | `logger.verbose('Informação detalhada', 'ServiceName')` |

### Exemplo de Uso

```typescript
@Injectable()
export class EntityService {
  constructor(
    private readonly logger: CustomLoggerService
  ) {}

  async findAll(): Promise<TbEntity[]> {
    try {
      this.logger.log('Iniciando busca de entidades', 'EntityService');
      const entities = await this.repository.find();
      this.logger.log(`Encontradas ${entities.length} entidades`, 'EntityService');
      return entities;
    } catch (error) {
      this.logger.error('Erro ao buscar entidades', error.stack, 'EntityService');
      throw new InternalServerErrorException('Erro ao buscar entidades');
    }
  }
}
```

### Boas Práticas

1. Sempre inclua o contexto (nome do serviço) nos logs
2. Use o nível apropriado para cada situação
3. Inclua stack traces em logs de erro
4. Mantenha mensagens claras e informativas
5. Evite logs sensíveis (senhas, tokens, etc.)

## Exemplo de Uso

```typescript
// DTO com validações
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEmail()
  supplierEmail: string;
}

// Controller com validações
@Controller('products')
export class ProductsController {
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @UseInterceptors(HalContentNegotiationInterceptor)
  async create(@Body() createProductDto: CreateProductDto) {
    // ...
  }
}
```

## Content Negotiation

A API suporta os seguintes formatos de resposta:
- `application/hal+json` (padrão)
- `application/json`

Para especificar o formato desejado, use o header `Accept`:
```bash
# Para HAL+JSON
curl -H "Accept: application/hal+json" http://localhost:3000/products

# Para JSON
curl -H "Accept: application/json" http://localhost:3000/products

# Para XML
curl -H "Accept: application/xml" http://localhost:3000/products
```
