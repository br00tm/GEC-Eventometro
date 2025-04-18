# Exemplos Incorretos de JSON para Operações da API

Este documento contém exemplos de JSONs incorretos para cada entidade, com múltiplos erros no mesmo JSON.

## 1. Local

### Create com múltiplos erros
```json
{
  "nome": "Centro de Convenções",
  "uf": "XX",
  "cidade": "S",
  "bairro": "C",
  "lotacao": 200
}
```
**Erros esperados**:
- "Já existe um Local com este nome"
- "UF deve ser válida (2 letras)"
- "Nome da cidade deve ter pelo menos 2 caracteres"
- "Nome do bairro deve ter pelo menos 2 caracteres"
- "Lotação deve ser no mínimo 500"

## 2. Evento

### Create com múltiplos erros
```json
{
  "nome": "Conferência de Tecnologia 2023",
  "data": "25/10/2023",
  "local_id": 99
}
```
**Erros esperados**:
- "Já existe um Evento com este nome nesta data"
- "Data do Evento deve seguir o padrão yyyy-MM-dd"
- "Local não encontrado"

## 3. Participante

### Create com múltiplos erros
```json
{
  "nome": "J",
  "email": "carlos@email.com",
  "telefone": "11987654321",
  "endereco": ""
}
```
**Erros esperados**:
- "Nome deve ter pelo menos 2 caracteres"
- "Já existe um participante cadastrado com este email"
- "Telefone deve estar no formato (99) 99999-9999"
- "Endereço não pode ser vazio"

## 4. Funcionário

### Create com múltiplos erros
```json
{
  "nome": "L",
  "cargo": "",
  "matricula": "FUNC001",
  "carga_horaria": -10.0
}
```
**Erros esperados**:
- "Nome deve ter pelo menos 2 caracteres"
- "Cargo não pode ser vazio"
- "Já existe um funcionário cadastrado com esta matrícula"
- "A carga horária não pode ser negativa"

## 5. Palestrante

### Create com múltiplos erros
```json
{
  "nome": "D",
  "email": "joao@email.com",
  "especialidade": "",
  "nome_palestra": "B"
}
```
**Erros esperados**:
- "Nome deve ter pelo menos 2 caracteres"
- "Já existe um palestrante cadastrado com este email"
- "Especialidade não pode ser vazia"
- "Nome da Palestra deve ter entre 2 e 100 letras"

## 6. Patrocinador

### Create com múltiplos erros
```json
{
  "nome": "T",
  "empresa": "",
  "cnpj": "12345678000190",
  "endereco": ""
}
```
**Erros esperados**:
- "Nome deve ter pelo menos 2 caracteres"
- "Empresa não pode ser vazia"
- "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX"
- "Endereço não pode ser vazio"

## 7. Avaliação

### Create com múltiplos erros
```json
{
  "nota": 12.5,
  "comentarios": "",
  "data_avaliacao": "20/12/2023",
  "participante": "Carlos Silva",
  "participante_id": 99,
  "evento_id": 99
}
```
**Erros esperados**:
- "Nota máxima é 10"
- "Comentários não podem ser vazios"
- "Data da avaliação deve seguir o padrão yyyy-MM-dd"
- "Participante não encontrado"
- "Evento não encontrado"

## 8. Certificado

### Create com múltiplos erros
```json
{
  "nome": "",
  "data_emissao": "16/12/2023",
  "tipo_certificado": "Desconhecido",
  "participante_id": 99,
  "evento_id": 99
}
```
**Erros esperados**:
- "Nome do certificado não pode ser vazio"
- "Código de Validação deve ser preenchido"
- "Data de emissão deve seguir o padrão yyyy-MM-dd"
- "Tipo de certificado inválido"
- "Participante não encontrado"
- "Evento não encontrado"

## 9. Presença

### Create com múltiplos erros
```json
{
  "data": "15/12/2023",
  "horario": "9:30 AM",
  "tipo_presenca": "Check-in",
  "modo_registro": "",
  "participante_id": 99,
  "evento_id": 99
}
```
**Erros esperados**:
- "Data deve seguir o padrão yyyy-MM-dd"
- "Horário deve seguir o padrão HH:MM"
- "Tipo de presença deve ser 'Entrada' ou 'Saída'"
- "Modo de registro não pode ser vazio"
- "Participante não encontrado"
- "Evento não encontrado"