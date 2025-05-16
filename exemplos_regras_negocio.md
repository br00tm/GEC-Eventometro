
# Exemplos de JSON para Testar Regras de Negócio

Este documento contém exemplos de JSONs para testar as regras de negócio das entidades Certificado, Presença e Avaliação.

## Certificados

### Correto: Create (POST /certificado)
```json
{
  "nome": "Certificado de Participação - Conferência de Tecnologia 2023",
  "data_emissao": "2023-12-16",
  "cod_validacao": 123456,
  "tipo_certificado": "Participação",
  "descricao": "Certificado emitido para comprovar participação no evento",
  "participante": {
    "id": 1,
    "nome": "Carlos Silva"
  },
  "evento": {
    "id": 1,
    "nome": "Conferência de Tecnologia 2023"
  }
}
```

### Erro: Descrição muito curta (RN3)
```json
{
  "nome": "Certificado de Participação - Conferência de Tecnologia 2023",
  "data_emissao": "2023-12-16",
  "cod_validacao": 123456,
  "tipo_certificado": "Participação",
  "descricao": "Ce",
  "participante": {
    "id": 1,
    "nome": "Carlos Silva"
  },
  "evento": {
    "id": 1,
    "nome": "Conferência de Tecnologia 2023"
  }
}
```
**Erro esperado**: "A descrição deve ter entre 3 e 100 caracteres!"

### Erro: Participante já possui certificado para este evento (RN1)
```json
{
  "nome": "Certificado de Participação - Conferência de Tecnologia 2023",
  "data_emissao": "2023-12-16",
  "cod_validacao": 123456,
  "tipo_certificado": "Participação",
  "descricao": "Certificado emitido para comprovar participação no evento",
  "participante": {
    "id": 1,
    "nome": "Carlos Silva"
  },
  "evento": {
    "id": 1,
    "nome": "Conferência de Tecnologia 2023"
  }
}
```
**Erro esperado**: "Este participante já possui um certificado para este evento!"

### Erro: Participante sem presença no evento (RN2)
```json
{
  "nome": "Certificado de Participação - Conferência de Tecnologia 2023",
  "data_emissao": "2023-12-16",
  "cod_validacao": 123456,
  "tipo_certificado": "Participação",
  "descricao": "Certificado emitido para comprovar participação no evento",
  "participante": {
    "id": 2,
    "nome": "Roberto Santos"
  },
  "evento": {
    "id": 1,
    "nome": "Conferência de Tecnologia 2023"
  }
}
```
**Erro esperado**: "O participante não possui presença registrada neste evento!"

## Presenças

### Correto: Create (POST /presenca)
```json
{
  "data": "2023-12-15",
  "horario": "09:30",
  "tipo_presenca": "Entrada",
  "modo_registro": "QR Code",
  "participante_id": 1,
  "evento_id": 2
}
```

### Erro: Participante já possui presença no evento (RN1)
```json
{
  "data": "2023-12-15",
  "horario": "14:30",
  "tipo_presenca": "Saída",
  "modo_registro": "QR Code",
  "participante_id": 1,
  "evento_id": 1
}
```
**Erro esperado**: "Este participante já possui presença registrada neste evento"

### Erro: Data diferente do dia do evento (RN2)
```json
{
  "data": "2023-12-16",
  "horario": "09:30",
  "tipo_presenca": "Entrada",
  "modo_registro": "QR Code",
  "participante_id": 2,
  "evento_id": 1
}
```
**Erro esperado**: "Só é possível registrar presença no mesmo dia do evento"

### Erro: Participante com presença em outro evento no mesmo dia (RN3)
```json
{
  "data": "2023-12-15",
  "horario": "09:30",
  "tipo_presenca": "Entrada",
  "modo_registro": "QR Code",
  "participante_id": 1,
  "evento_id": 3
}
```
**Erro esperado**: "Este participante já possui presença registrada em outro evento neste dia"

## Avaliações

### Correto: Create (POST /avaliacao)
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

### Erro: Participante já avaliou este evento (RN1)
```json
{
  "nota": 4.0,
  "comentarios": "Excelente evento, recomendo!",
  "data_avaliacao": "2023-12-21",
  "participante": "Carlos Silva",
  "participante_id": 1,
  "evento_id": 1
}
```
**Erro esperado**: "Este participante já avaliou este evento"

### Erro: Participante sem presença no evento (RN2)
```json
{
  "nota": 4.0,
  "comentarios": "Evento interessante!",
  "data_avaliacao": "2023-12-20",
  "participante": "Ana Lima",
  "participante_id": 2,
  "evento_id": 2
}
```
**Erro esperado**: "O participante precisa ter presença no evento para avaliá-lo"

### Erro: Nota extrema (1 ou 5) sem comentários (RN3)
```json
{
  "nota": 5.0,
  "comentarios": "",
  "data_avaliacao": "2023-12-20",
  "participante": "Carlos Silva",
  "participante_id": 1,
  "evento_id": 2
}
```
**Erro esperado**: "Para notas 1 ou 5, é obrigatório incluir comentários"
```



```
# Exemplos de JSON com Múltiplos Erros de Validação

Este documento contém exemplos de JSONs para cada entidade que causam múltiplos erros de validação simultâneos, sem necessidade de consulta ao banco de dados.

## Certificado

### Create com múltiplos erros (POST /certificado)
```json
{
  "nome": "C",
  "data_emissao": "16/12/2023",
  "cod_validacao": "",
  "tipo_certificado": "X",
  "descricao": "AB",
  "participante": {
    "nome": "Carlos Silva"
  },
  "evento": {
    "nome": "Conferência de Tecnologia 2023"
  }
}
```
**Erros esperados**:
- "Nome do Certificado deve ter entre 2 e 100 letras!"
- "Data de Emissão deve seguir o padrão yyyy-MM-dd!"
- "Código de Validação deve ser preenchido!"
- "Tipo de Certificado deve ter entre 2 e 50 letras!"
- "A descrição deve ter entre 3 e 100 caracteres!"
- "Participante não encontrado (ID não informado)!"
- "Evento não encontrado (ID não informado)!"

## Presença

### Create com múltiplos erros (POST /presenca)
```json
{
  "data": "15/12/2023",
  "horario": "9h30",
  "tipo_presenca": "X",
  "modo_registro": "",
  "participante_id": "",
  "evento_id": ""
}
```
**Erros esperados**:
{
	"message": "Nome do Certificado deve ter pelo menos 2 caracteres; Data de emissão deve seguir o formato yyyy-MM-dd; Código de validação é obrigatório; Tipo de certificado deve ter pelo menos 2 caracteres; A descrição deve ter entre 3 e 100 caracteres"
}

## Avaliação

### Create com múltiplos erros (POST /avaliacao)
```json
{
  "nota": 12.5,
  "comentarios": null,
  "data_avaliacao": "20/12/2023",
  "participante": "",
  "participante_id": "",
  "evento_id": ""
}
```
**Erros esperados**:
- "Nota máxima é 5!"
- "Comentários devem estar presentes, mesmo que vazios!"
- "Data da Avaliação deve seguir o padrão yyyy-MM-dd!"
- "Participante da Avaliação deve ser preenchido!"
- "Participante não encontrado (ID inválido)!"
- "Evento não encontrado (ID inválido)!"
```