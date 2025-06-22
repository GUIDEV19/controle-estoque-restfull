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

# Controle de Estoque REST API

API REST completa para controle de estoque desenvolvida em NestJS, seguindo os princípios REST e implementando content negotiation, HAL e múltiplos níveis de maturidade REST.

## 🚀 Funcionalidades

- **Autenticação JWT** com extração automática de dados do usuário
- **Content Negotiation** suportando JSON, XML e HAL
- **Auditoria automática** de todas as operações
- **Arquitetura REST** seguindo todos os níveis de maturidade
- **Interceptors personalizados** para contexto do usuário
- **Decorators customizados** para extração de dados

## 🔐 Sistema de Autenticação

### Decorator `@CurrentUser`

Extrai automaticamente os dados do usuário autenticado:

```typescript
@Post()
async create(
    @Body() createDto: CreateDto,
    @CurrentUser() user: TbUser
) {
    // user.id, user.name, user.email disponíveis
    return this.service.create(createDto, user);
}
```

### Uso em Controllers

```typescript
@Controller('products')
@UseGuards(JwtAuthGuard)
@UseInterceptors(UserContextInterceptor)
export class ProductsController {
    
    @Post()
    async create(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user: TbUser
    ) {
        return this.productsService.create(createProductDto, user);
    }
}
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── auth/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts    # Decorator para extrair usuário
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── user-context.interceptor.ts  # Contexto do usuário
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── products/
│   ├── categories/
│   └── users/
├── common/
└── config/
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar com Docker
docker-compose up -d

# Executar aplicação
npm run start:dev
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=estoque
```

## 📖 Documentação

- [Guia de Autenticação](docs/authentication-guide.md)
- [Exemplos de Teste](docs/test-examples.md)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 🔄 Fluxo de Autenticação

1. **Request** com token JWT no header `Authorization: Bearer <token>`
2. **JwtAuthGuard** valida o token
3. **JwtStrategy** extrai payload e busca usuário no banco
4. **UserContextInterceptor** adiciona contexto adicional
5. **@CurrentUser decorator** extrai usuário do request
6. **Controller** recebe usuário tipado como `TbUser`

## 📊 Content Negotiation

O sistema suporta múltiplos formatos:

```bash
# JSON (padrão)
Accept: application/json

# XML (se implementado)
Accept: application/xml

# HAL
Accept: application/hal+json
```

## 🔍 Exemplo de Uso

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

### 2. Criar Produto (autenticado)
```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Produto", "price": 99.99}'
```

### 3. Obter Informações do Usuário
```bash
curl -X GET http://localhost:3000/status/user-info \
  -H "Authorization: Bearer <token>"
```

## 🛡️ Segurança

- Tokens JWT com expiração configurável
- Validação automática em cada requisição
- Usuário buscado do banco a cada validação
- Tratamento de erros de autenticação
- Auditoria automática de todas as operações

## 📈 Próximos Passos

- [ ] Implementar serialização XML
- [ ] Adicionar suporte completo a HAL
- [ ] Implementar rate limiting
- [ ] Adicionar cache Redis
- [ ] Implementar refresh tokens

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
