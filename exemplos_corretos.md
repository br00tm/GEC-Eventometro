# Exemplos Corretos de JSON para Operações da API

Este documento contém exemplos de JSONs corretos para cada tipo de operação da API.

## 1. Local

### Listar todos (GET /local)
```
GET /local
```

### Listar por ID (GET /local/1)
```
GET /local/1
```

### Create (POST /local)
```json
{
  "nome": "Centro de Eventos Tecnológicos",
  "uf": "MG",
  "cidade": "Belo Horizonte",
  "bairro": "Savassi",
  "lotacao": 1500
}
```

### Update (PUT /local/3)
```json
{
  "nome": "Centro de Eventos Tecnológicos",
  "uf": "MG",
  "cidade": "Belo Horizonte",
  "bairro": "Funcionários",
  "lotacao": 2000
}
```

### Delete (DELETE /local/3)
```
DELETE /local/3
```

## 2. Evento

### Listar todos (GET /evento)
```
GET /evento
```

### Listar por ID (GET /evento/1)
```
GET /evento/1
```

### Create (POST /evento)
```json
{
  "nome": "Hackathon de Inovação",
  "data": "2023-10-25",
  "local_id": 1
}
```

### Update (PUT /evento/3)
```json
{
  "nome": "Hackathon de Inovação e Tecnologia",
  "data": "2023-11-05",
  "local_id": 1
}
```

### Delete (DELETE /evento/3)
```
DELETE /evento/3
```

## 3. Participante

### Listar todos (GET /participante)
```
GET /participante
```

### Listar por ID (GET /participante/1)
```
GET /participante/1
```

### Create (POST /participante)
```json
{
  "nome": "Roberto Santos",
  "email": "roberto@email.com",
  "telefone": "(31) 94567-8901",
  "endereco": "Av Paulista, 789"
}
```

### Update (PUT /participante/3)
```json
{
  "nome": "Roberto Santos",
  "email": "roberto.santos@email.com",
  "telefone": "(31) 94567-8901",
  "endereco": "Av Paulista, 800"
}
```

### Delete (DELETE /participante/3)
```
DELETE /participante/3
```

## 4. Funcionário

### Listar todos (GET /funcionario)
```
GET /funcionario
```

### Listar por ID (GET /funcionario/1)
```
GET /funcionario/1
```

### Create (POST /funcionario)
```json
{
  "nome": "José Oliveira",
  "cargo": "Técnico de Suporte",
  "matricula": "FUNC003",
  "carga_horaria": 40.0
}
```

### Update (PUT /funcionario/3)
```json
{
  "nome": "José Oliveira",
  "cargo": "Técnico de Suporte Senior",
  "matricula": "FUNC003",
  "carga_horaria": 36.0
}
```

### Delete (DELETE /funcionario/3)
```
DELETE /funcionario/3
```

## 5. Palestrante

### Listar todos (GET /palestrante)
```
GET /palestrante
```

### Listar por ID (GET /palestrante/1)
```
GET /palestrante/1
```

### Create (POST /palestrante)
```json
{
  "nome": "Dr. João Santos",
  "email": "joao@email.com",
  "especialidade": "Inteligência Artificial",
  "nome_palestra": "O Futuro da IA"
}
```

### Update (PUT /palestrante/3)
```json
{
  "nome": "Dr. João Santos",
  "email": "joao.santos@email.com",
  "especialidade": "Inteligência Artificial e Machine Learning",
  "nome_palestra": "O Futuro da IA na Indústria 4.0"
}
```

### Delete (DELETE /palestrante/3)
```
DELETE /palestrante/3
```

## 6. Patrocinador

### Listar todos (GET /patrocinador)
```
GET /patrocinador
```

### Listar por ID (GET /patrocinador/1)
```
GET /patrocinador/1
```

### Create (POST /patrocinador)
```json
{
  "nome": "TechCorp",
  "empresa": "TechCorp Ltda",
  "cnpj": "12.345.678/0001-90",
  "endereco": "Rua da Tecnologia, 789"
}
```

### Update (PUT /patrocinador/3)
```json
{
  "nome": "TechCorp",
  "empresa": "TechCorp Inovações Ltda",
  "cnpj": "12.345.678/0001-90",
  "endereco": "Avenida da Tecnologia, 1000"
}
```

### Delete (DELETE /patrocinador/3)
```
DELETE /patrocinador/3
```

## 7. Avaliação

### Listar todos (GET /avaliacao)
```
GET /avaliacao
```

### Listar por ID (GET /avaliacao/1)
```
GET /avaliacao/1
```

### Create (POST /avaliacao)
```json
{
  "nota": 4.5,
  "comentarios": "Evento muito bem organizado e com ótimos palestrantes.",
  "data_avaliacao": "2023-12-20",
  "participante": "Carlos Silva",
  "participante_id": 1,
  "evento_id": 1
}
```

### Update (PUT /avaliacao/3)
```json
{
  "nota": 5.0,
  "comentarios": "Excelente organização e conteúdo relevante.",
  "data_avaliacao": "2023-12-21",
  "participante": "Carlos Silva",
  "participante_id": 1,
  "evento_id": 1
}
```

### Delete (DELETE /avaliacao/3)
```
DELETE /avaliacao/3
```

## 8. Certificado

### Listar todos (GET /certificado)
```
GET /certificado
```

### Listar por ID (GET /certificado/1)
```
GET /certificado/1
```

### Create (POST /certificado)
```json
{
  "nome": "Certificado de Participação - Conferência de Tecnologia 2023",
  "data_emissao": "2023-12-16",
  "cod_validacao": 123456,
  "tipo_certificado": "Participação",
  "participante_id": 1,
  "evento_id": 1
}
```

### Update (PUT /certificado/3)
```json
{
  "nome": "Certificado de Participação - Conferência de Tecnologia 2023",
  "data_emissao": "2023-12-16",
  "cod_validacao": 654321,
  "tipo_certificado": "Participação Especial",
  "participante_id": 1,
  "evento_id": 1
}
```

### Delete (DELETE /certificado/3)
```
DELETE /certificado/3
```

## 9. Presença

### Listar todos (GET /presenca)
```
GET /presenca
```

### Listar por ID (GET /presenca/1)
```
GET /presenca/1
```

### Create (POST /presenca)
```json
{
  "data": "2023-12-15",
  "horario": "09:30",
  "tipo_presenca": "Entrada",
  "modo_registro": "QR Code",
  "participante_id": 1,
  "evento_id": 1
}
```

### Update (PUT /presenca/3)
```json
{
  "data": "2023-12-15",
  "horario": "17:45",
  "tipo_presenca": "Saída",
  "modo_registro": "QR Code",
  "participante_id": 1,
  "evento_id": 1
}
```

### Delete (DELETE /presenca/3)
```
DELETE /presenca/3
```