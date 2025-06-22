# Exemplos de Teste - Sistema de Autenticação

## Pré-requisitos

1. Servidor rodando
2. Usuário criado no sistema
3. Token JWT válido

## 1. Obter Token JWT

### Login do Usuário
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Usuário Exemplo",
    "email": "usuario@exemplo.com"
  }
}
```

## 2. Testar Endpoints Autenticados

### Criar Produto (com dados do usuário)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Produto Teste",
    "description": "Descrição do produto",
    "price": 99.99,
    "categoryId": 1
  }'
```

**Log esperado no console:**
```
Usuário autenticado: { id: 1, name: 'Usuário Exemplo', email: 'usuario@exemplo.com' }
Request processed by user: usuario@exemplo.com (ID: 1)
```

### Listar Categorias (com contexto do usuário)
```bash
curl -X GET http://localhost:3000/categories \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Log esperado no console:**
```
Listando categorias para usuário: usuario@exemplo.com
Request processed by user: usuario@exemplo.com (ID: 1)
```

### Obter Informações do Usuário
```bash
curl -X GET http://localhost:3000/status/user-info \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta esperada:**
```json
{
  "message": "Informações do usuário autenticado",
  "user": {
    "id": 1,
    "name": "Usuário Exemplo",
    "email": "usuario@exemplo.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 3. Testar Endpoints Públicos

### Status da Aplicação (sem autenticação)
```bash
curl -X GET http://localhost:3000/status
```

**Resposta esperada:**
```json
{
  "name": "controle-estoque-rest-full",
  "version": "1.0.0"
}
```

## 4. Testar Content Negotiation

### Resposta em JSON (padrão)
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json"
```

### Resposta em HAL (se implementado)
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/hal+json"
```

## 5. Testar Tratamento de Erros

### Token Inválido
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer token-invalido"
```

**Resposta esperada:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Token Expirado
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta esperada:**
```json
{
  "statusCode": 401,
  "message": "Token expired"
}
```

### Sem Token
```bash
curl -X GET http://localhost:3000/products
```

**Resposta esperada:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 6. Testar com Postman

### Configuração do Postman

1. **Criar Collection** para a API
2. **Configurar Variável de Ambiente:**
   - `baseUrl`: `http://localhost:3000`
   - `token`: (será preenchido após login)

3. **Request de Login:**
   ```
   POST {{baseUrl}}/auth/login
   Body: {
     "email": "usuario@exemplo.com",
     "password": "senha123"
   }
   ```

4. **Script de Teste para Login:**
   ```javascript
   pm.test("Login successful", function () {
       pm.response.to.have.status(200);
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.access_token);
   });
   ```

5. **Request Autenticado:**
   ```
   GET {{baseUrl}}/products
   Headers: Authorization: Bearer {{token}}
   ```

## 7. Testar Auditoria

### Verificar Logs do Sistema
```bash
# Verificar logs do console para auditoria
tail -f logs/app.log
```

**Logs esperados:**
```
[INFO] Request processed by user: usuario@exemplo.com (ID: 1)
[INFO] Usuário usuario@exemplo.com criando produto
[INFO] Request processed by user: usuario@exemplo.com (ID: 1)
```

## 8. Testar Performance

### Múltiplas Requisições
```bash
# Testar com múltiplas requisições simultâneas
for i in {1..10}; do
  curl -X GET http://localhost:3000/products \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." &
done
wait
```

## 9. Testar Segurança

### Tentativa de Acesso sem Autenticação
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Produto Teste"}'
```

### Tentativa com Token Manipulado
```bash
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.manipulado"
```

## 10. Validação dos Dados

### Verificar se o Produto foi Criado com o Usuário Correto
```bash
# Após criar um produto, verificar no banco de dados
SELECT p.*, u.name as created_by 
FROM products p 
JOIN users u ON p.userCreatedId = u.id 
WHERE p.id = [ID_DO_PRODUTO];
```

**Resultado esperado:**
```
id | name | userCreatedId | created_by
1  | Produto Teste | 1 | Usuário Exemplo
``` 