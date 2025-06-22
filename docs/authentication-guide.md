# Guia de Autenticação e Contexto do Usuário

## Visão Geral

Este sistema implementa autenticação JWT com extração automática dos dados do usuário através de decorators personalizados, seguindo os princípios REST e implementando content negotiation.

## Componentes Principais

### 1. Decorator `@CurrentUser`

O decorator `@CurrentUser` extrai automaticamente os dados do usuário autenticado do request:

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TbUser } from '../users/domain/user.entity';

@Post()
async create(
    @Body() createDto: CreateDto,
    @CurrentUser() user: TbUser
) {
    // user contém todos os dados do usuário autenticado
    console.log('Usuário:', user.name, user.email);
    return this.service.create(createDto, user);
}
```

### 2. Guard JWT (`@UseGuards(JwtAuthGuard)`)

Aplica autenticação JWT em controllers ou métodos específicos:

```typescript
// Aplicar em todo o controller
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    // Todos os métodos requerem autenticação
}

// Aplicar em método específico
@UseGuards(JwtAuthGuard)
@Get('protected')
getProtectedData(@CurrentUser() user: TbUser) {
    // Apenas este método requer autenticação
}
```

### 3. Interceptor de Contexto do Usuário

Adiciona informações adicionais do contexto do usuário:

```typescript
@Controller('products')
@UseInterceptors(UserContextInterceptor)
export class ProductsController {
    // Adiciona userContext ao request
}
```

## Exemplos de Uso

### Controller com Autenticação Completa

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
        // user.id, user.name, user.email disponíveis
        return this.productsService.create(createProductDto, user);
    }
    
    @Get()
    async findAll(@CurrentUser() user: TbUser) {
        // Log do usuário que fez a requisição
        console.log(`Usuário ${user.email} listando produtos`);
        return this.productsService.findAll();
    }
}
```

### Método Específico com Autenticação

```typescript
@Controller('status')
export class StatusController {
    
    @Public()
    @Get()
    getStatus() {
        // Endpoint público
        return { status: 'OK' };
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('user-info')
    getUserInfo(@CurrentUser() user: TbUser) {
        // Endpoint autenticado
        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }
}
```

## Fluxo de Autenticação

1. **Request chega** com token JWT no header `Authorization: Bearer <token>`
2. **JwtAuthGuard** intercepta e valida o token
3. **JwtStrategy** extrai o payload e busca o usuário no banco
4. **UserContextInterceptor** adiciona contexto adicional se necessário
5. **@CurrentUser decorator** extrai o usuário do request
6. **Controller method** recebe o usuário tipado como `TbUser`

## Content Negotiation

O sistema suporta múltiplos formatos de resposta:

```typescript
// JSON (padrão)
Accept: application/json

// XML (se implementado)
Accept: application/xml

// HAL (Hypertext Application Language)
Accept: application/hal+json
```

## Auditoria e Logs

O sistema automaticamente registra:
- Usuário que fez cada requisição
- Timestamp da operação
- Contexto adicional quando necessário

## Segurança

- Tokens JWT com expiração configurável
- Validação automática em cada requisição
- Usuário buscado do banco a cada validação
- Tratamento de erros de autenticação

## Configuração

Certifique-se de que as seguintes variáveis de ambiente estejam configuradas:

```env
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
```

## Próximos Passos

Para implementar content negotiation completa:

1. Adicionar interceptors para XML
2. Implementar serialização HAL
3. Configurar content negotiation no main.ts
4. Adicionar suporte a múltiplos formatos de resposta 