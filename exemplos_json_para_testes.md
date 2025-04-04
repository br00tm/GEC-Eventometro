# Exemplos de JSON para Testes da API

Este documento contém exemplos de JSONs para testar cada model da API:
- **JSONs Corretos**: Exemplos que devem ser aceitos com sucesso
- **JSONs Incorretos**: Exemplos que devem falhar nas validações e gerar erros

## 1. Local

### JSON Correto:
```json
{
  "nome": "Centro de Convenções ABC",
  "uf": "SP",
  "cidade": "São Paulo",
  "bairro": "Centro",
  "lotacao": 1200
}
```

### JSON Incorreto (Falha garantida):
```json
{
  "nome": "Centro de Eventos",
  "uf": "RJ",
  "cidade": "Rio de Janeiro",
  "bairro": "Ipanema",
  "lotacao": 200
}
{
  "nome": "C",
  "uf": "RJX",
  "cidade": "R",
  "bairro": "I",
  "lotacao": 200
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Lotação deve ser no mínimo 500!"
}
```

## 2. Evento

### JSON Correto:
```json
{
  "nome": "Conferência de Tecnologia 2023",
  "data": "2023-12-15",
  "local_id": 1
}
```

### JSON Incorreto (Falha garantida):
```json
{
  "nome": "Workshop de Inovação",
  "data": "15/12/2023",
  "local_id": 2
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Data do Evento deve seguir o padrão yyyy-MM-dd!"
}
```

## 3. Avaliacao

### JSON Correto:
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

### JSON Incorreto (Falha garantida):
```json
{
  "nota": 12,
  "comentarios": "Excelente!",
  "data_avaliacao": "2023-12-21",
  "participante": "Maria Santos",
  "participante_id": 2,
  "evento_id": 1
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Nota máxima é 10!"
}
```

## 4. Certificado

### JSON Correto:
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

### JSON Incorreto (Falha garantida):
```json
{
  "nome": "Certificado de Palestrante",
  "data_emissao": "2023-12-16",
  "tipo_certificado": "Palestrante",
  "participante_id": 2,
  "evento_id": 1
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Código de Validação deve ser preenchido!"
}
```

## 5. Presenca

### JSON Correto:
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

### JSON Incorreto (Falha garantida):
```json
{
  "data": "2023-12-15",
  "horario": "9:30 AM",
  "tipo_presenca": "Entrada",
  "modo_registro": "QR Code",
  "participante_id": 2,
  "evento_id": 1
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Horário deve seguir o padrão HH:MM!"
}
```

## 6. Participante

### JSON Correto:
```json
{
  "nome": "Lucas Oliveira",
  "email": "lucas@email.com",
  "telefone": "(11) 98765-4321",
  "endereco": "Rua das Flores, 123, São Paulo"
}
```

### JSON Incorreto (Falha garantida):
```json
{
  "nome": "Juliana Ferreira",
  "email": "juliana@email.com",
  "telefone": "11987654321",
  "endereco": "Avenida Paulista, 1000, São Paulo"
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Telefone deve seguir o padrão (99) 99999-9999!"
}
```

## 7. Palestrante

### JSON Correto:
```json
{
  "nome": "Dr. Pedro Santos",
  "email": "pedro@palestrante.com",
  "especialidade": "Inteligência Artificial",
  "nome_palestra": "O Futuro da IA no Brasil"
}
```

### JSON Incorreto (Falha garantida):
```json
{
  "nome": "Dra. Ana Rocha",
  "email": "ana@palestrante.com",
  "especialidade": "Blockchain",
  "nome_palestra": "B"
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Nome da Palestra deve ter entre 2 e 100 letras!"
}
```

## 8. Patrocinador

### JSON Correto:
```json
{
  "nome": "TechCorp",
  "empresa": "TechCorp Inovações Ltda",
  "cnpj": "12.345.678/0001-90",
  "endereco": "Avenida Tecnológica, 500, São Paulo"
}
```

### JSON Incorreto (Falha garantida):
```json
{
  "nome": "InovaTech",
  "empresa": "InovaTech Solutions",
  "cnpj": "12345678000190",
  "endereco": "Rua da Inovação, 200, Rio de Janeiro"
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "CNPJ deve seguir o padrão XX.XXX.XXX/XXXX-XX!"
}
```

## 9. Funcionario

### JSON Correto:
```json
{
  "nome": "Roberto Almeida",
  "cargo": "Coordenador de Eventos",
  "matricula": "FUNC00123",
  "carga_horaria": 40.0
}
```

### JSON Incorreto (Falha garantida):
```json
{
  "nome": "Amanda Silva",
  "cargo": "Assistente de Eventos",
  "matricula": "FUNC00124",
  "carga_horaria": -10.0
}
```

**Resposta de Erro Esperada:**
```json
{
  "message": "Carga horária não pode ser negativa!"
}
```

## Como Testar

Os exemplos deste documento foram cuidadosamente projetados para:

1. **JSONs Corretos**: Passar em todas as validações e serem aceitos pela API (status 200/201).
2. **JSONs Incorretos**: Falhar nas validações e gerar erros específicos (status 400).

Você pode testar através de:

- **Postman/Insomnia**: Copie e cole os exemplos e envie para os endpoints correspondentes.
- **cURL**: Use os comandos abaixo para fazer testes via terminal.

### Exemplos de Endpoints para Teste:

1. **Local**: POST /local
2. **Evento**: POST /evento
3. **Avaliacao**: POST /avaliacao
4. **Certificado**: POST /certificado
5. **Presenca**: POST /presenca
6. **Participante**: POST /participante
7. **Palestrante**: POST /palestrante
8. **Patrocinador**: POST /patrocinador
9. **Funcionario**: POST /funcionario

### Exemplos de Comandos CURL:

```bash
# Exemplo de requisição CORRETA (Local) - Deve ser ACEITA
curl -X POST http://localhost:3333/local \
  -H "Content-Type: application/json" \
  -d '{"nome":"Centro de Convenções ABC","uf":"SP","cidade":"São Paulo","bairro":"Centro","lotacao":1200}'

# Exemplo de requisição INCORRETA (Local) - Deve FALHAR
curl -X POST http://localhost:3333/local \
  -H "Content-Type: application/json" \
  -d '{"nome":"Centro de Eventos","uf":"RJ","cidade":"Rio de Janeiro","bairro":"Ipanema","lotacao":200}'
```