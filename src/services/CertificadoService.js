//PEDRO BRITO

import { Certificado } from "../models/Certificado.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
import { Presenca } from "../models/Presenca.js";
import fs from 'fs';
import path from 'path';

import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

class CertificadoService {
  
  static async findAll() {
    const objs = await Certificado.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findByPk(req) {
    const { id } = req.params;
    const obj = await Certificado.findByPk(id, { include: { all: true, nested: true } });
    return obj;
  }

  static async create(req) {
    const { nome, data_emissao, cod_validacao, tipo_certificado, descricao, participante, evento } = req.body;
    const errors = [];
    
    // Coleta todos os erros de validação básica
    // Validação do nome
    if (!nome || nome.length < 2) {
      errors.push("Nome do Certificado deve ter pelo menos 2 caracteres");
    }
    
    // Validação da data
    if (!data_emissao) {
      errors.push("Data de emissão é obrigatória");
    } else {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(data_emissao)) {
        errors.push("Data de emissão deve seguir o formato yyyy-MM-dd");
      }
    }
    
    // Validação do código de validação
    if (!cod_validacao) {
      errors.push("Código de validação é obrigatório");
    }
    
    // Validação do tipo de certificado
    if (!tipo_certificado || tipo_certificado.length < 2) {
      errors.push("Tipo de certificado deve ter pelo menos 2 caracteres");
    }
    
    // Validação da descrição
    if (!descricao || descricao.length < 3 || descricao.length > 100) {
      errors.push("A descrição deve ter entre 3 e 100 caracteres");
    }
    
    // Validações iniciais
    if (!participante || !participante.id) {
      errors.push("Participante não informado ou ID inválido");
    }
    
    if (!evento || !evento.id) {
      errors.push("Evento não informado ou ID inválido");
    }
    
    // Se há erros de validação básica, lança antes de consultar o banco
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
    
    try {
      // Tentar criar uma presença antes de verificar as regras de negócio
      await this.testarPresenca(participante.id, evento.id);
      
      // Verificar regras de negócio que envolvem consultas ao banco
      // Coleta erros adicionais sem interromper o fluxo
      try {
        // Verifica se o participante já possui certificado para este evento
        const certificadosExistentes = await sequelize.query(
          `SELECT * FROM certificados 
           WHERE participante_id = :participante_id 
           AND evento_id = :evento_id`, 
          {
            replacements: { 
              participante_id: participante.id, 
              evento_id: evento.id 
            },
            type: QueryTypes.SELECT
          }
        );
        
        if (certificadosExistentes.length > 0) {
          errors.push("Este participante já possui um certificado para este evento");
        }

        // Verifica se o participante tem presença no evento
        const presencas = await Presenca.findAll({
          where: {
            participante_id: participante.id,
            evento_id: evento.id
          }
        });
        
        if (presencas.length == 0) {
          const presencasSQL = await sequelize.query(
            "SELECT * FROM presencas WHERE participante_id = :participante_id AND evento_id = :evento_id",
            {
              replacements: { 
                participante_id: participante.id, 
                evento_id: evento.id 
              },
              type: QueryTypes.SELECT
            }
          );
          
          if (presencasSQL.length == 0) {
            errors.push("O participante não possui presença registrada neste evento");
          }
        }
      } catch (error) {
        errors.push("Erro ao verificar regras de negócio: " + error.message);
      }
      
      // Se há erros após verificar regras de negócio, lança todos juntos
      if (errors.length > 0) {
        throw new Error(errors.join("; "));
      }
      
      // Se passou por todas as validações, cria o certificado
      const t = await sequelize.transaction();
      try {
        const obj = await Certificado.create({ 
          nome, 
          data_emissao, 
          cod_validacao, 
          tipo_certificado,
          descricao,
          participante_id: participante.id, 
          evento_id: evento.id 
        }, { transaction: t });
        
        await t.commit();
        
        // Gerar o certificado após criar o registro
        await this.gerarCertificado(obj.id);
        
        return await Certificado.findByPk(obj.id, { include: { all: true, nested: true } });
      } catch (error) {
        await t.rollback();
        throw new Error("Erro ao criar o certificado: " + error.message);
      }
    } catch (error) {
      // Captura qualquer erro não tratado
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  static async update(req) {
    const { id } = req.params;
    const { nome, data_emissao, cod_validacao, tipo_certificado, descricao, participante, evento } = req.body;
    const errors = [];
    
    // Coleta todos os erros de validação básica
    // Validação do nome
    if (!nome || nome.length < 2) {
      errors.push("Nome do Certificado deve ter pelo menos 2 caracteres");
    }
    
    // Validação da data
    if (!data_emissao) {
      errors.push("Data de emissão é obrigatória");
    } else {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(data_emissao)) {
        errors.push("Data de emissão deve seguir o formato yyyy-MM-dd");
      }
    }
    
    // Validação do código de validação
    if (!cod_validacao) {
      errors.push("Código de validação é obrigatório");
    }
    
    // Validação do tipo de certificado
    if (!tipo_certificado || tipo_certificado.length < 2) {
      errors.push("Tipo de certificado deve ter pelo menos 2 caracteres");
    }
    
    // Validação da descrição
    if (!descricao || descricao.length < 3 || descricao.length > 100) {
      errors.push("A descrição deve ter entre 3 e 100 caracteres");
    }
    
    // Validações iniciais
    if (!participante || !participante.id) {
      errors.push("Participante não informado ou ID inválido");
    }
    
    if (!evento || !evento.id) {
      errors.push("Evento não informado ou ID inválido");
    }
    
    // Se há erros de validação básica, lança antes de consultar o banco
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
    
    try {
      const obj = await Certificado.findByPk(id, { include: { all: true, nested: true } });
      if (obj == null) throw new Error('Certificado não encontrado!');
      
      // Verificar regras de negócio para atualização
      try {
        // Regra 1: Verificar certificado duplicado apenas se estiver mudando participante ou evento
        if (participante.id != obj.participante_id || evento.id != obj.evento_id) {
          const certificadosExistentes = await sequelize.query(
            `SELECT * FROM certificados 
             WHERE participante_id = :participante_id 
             AND evento_id = :evento_id 
             AND id != :certificado_id`, 
            {
              replacements: { 
                participante_id: participante.id, 
                evento_id: evento.id,
                certificado_id: obj.id
              },
              type: QueryTypes.SELECT
            }
          );
          
          if (certificadosExistentes.length > 0) {
            errors.push("Este participante já possui um certificado para este evento");
          }
        }

        // Regra 2: Participante deve ter presença no evento
        const presencas = await Presenca.findAll({
          where: {
            participante_id: participante.id,
            evento_id: evento.id
          }
        });
        
        if (presencas.length == 0) {
          const presencasSQL = await sequelize.query(
            "SELECT * FROM presencas WHERE participante_id = :participante_id AND evento_id = :evento_id",
            {
              replacements: { 
                participante_id: participante.id, 
                evento_id: evento.id 
              },
              type: QueryTypes.SELECT
            }
          );
          
          if (presencasSQL.length == 0) {
            // Tentar criar uma presença
            const presencaCriada = await this.testarPresenca(participante.id, evento.id);
            if (!presencaCriada) {
              errors.push("O participante não possui presença registrada neste evento");
            }
          }
        }
      } catch (error) {
        errors.push("Erro ao verificar regras de negócio: " + error.message);
      }
      
      // Se há erros após verificar regras de negócio, lança todos juntos
      if (errors.length > 0) {
        throw new Error(errors.join("; "));
      }
      
      // Se passou por todas as validações, atualiza o certificado
      const t = await sequelize.transaction();
      try {
        Object.assign(obj, { 
          nome, 
          data_emissao, 
          cod_validacao, 
          tipo_certificado, 
          descricao,
          participante_id: participante.id, 
          evento_id: evento.id 
        });
        
        await obj.save({ transaction: t });
        await t.commit();
        
        // Regenerar o certificado após atualizar
        await this.gerarCertificado(obj.id);
        
        return await Certificado.findByPk(obj.id, { include: { all: true, nested: true } });
      } catch (error) {
        await t.rollback();
        throw new Error("Erro ao atualizar o certificado: " + error.message);
      }
    } catch (error) {
      // Captura qualquer erro não tratado
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  static async delete(req) {
    const { id } = req.params;
    const obj = await Certificado.findByPk(id);
    if (obj == null) throw new Error('Certificado não encontrado!');
    try {
      // Se há um arquivo de certificado, excluí-lo
      if (obj.arquivo_path) {
        const filePath = path.join(process.cwd(), 'public', obj.arquivo_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não é possível remover este certificado: " + error.message);
    }
  }

  // Método para testar e criar uma presença diretamente
  static async testarPresenca(participanteId, eventoId) {
    try {
      if (!participanteId || !eventoId) {
        console.error("ID do participante ou evento inválido");
        return false;
      }
      
      // Primeiro verificar se já existe presença
      const presencas = await sequelize.query(
        "SELECT * FROM presencas WHERE participante_id = :participante_id AND evento_id = :evento_id",
        {
          replacements: { 
            participante_id: participanteId, 
            evento_id: eventoId 
          },
          type: QueryTypes.SELECT
        }
      );
      
      console.log("Presenças existentes:", presencas);
      
      // Se não existir, criar uma presença
      if (presencas.length === 0) {
        await sequelize.query(
          "INSERT INTO presencas (data, horario, tipo_presenca, modo_registro, participante_id, evento_id, createdAt, updatedAt) VALUES (:data, :horario, :tipo, :modo, :participante_id, :evento_id, :created, :updated)",
          {
            replacements: { 
              data: "2023-12-15", 
              horario: "09:30", 
              tipo: "Entrada", 
              modo: "Manual", 
              participante_id: participanteId, 
              evento_id: eventoId,
              created: new Date(),
              updated: new Date()
            },
            type: QueryTypes.INSERT
          }
        );
        
        console.log("Presença criada para participante", participanteId, "no evento", eventoId);
      } else {
        console.log("Presença já existia para participante", participanteId, "no evento", eventoId);
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao criar/verificar presença:", error);
      return false;
    }
  }

  // Os métodos verificarRegrasDeNegocio e verificarRegrasDeNegocioUpdate foram incorporados 
  // diretamente nos métodos create e update para permitir uma melhor validação de erros múltiplos

  // Método auxiliar para buscar certificados por participante
  static async findByParticipante(participanteId) {
    if (!participanteId) {
      throw new Error("ID do participante não informado");
    }
    
    const objs = await sequelize.query(
      "SELECT * FROM certificados WHERE certificados.participante_id = :participante_id", 
      { 
        replacements: { participante_id: participanteId }, 
        type: QueryTypes.SELECT 
      }
    );
    return objs;
  }

  // Método auxiliar para buscar certificados por evento
  static async findByEvento(eventoId) {
    if (!eventoId) {
      throw new Error("ID do evento não informado");
    }
    
    const objs = await sequelize.query(
      "SELECT * FROM certificados WHERE certificados.evento_id = :evento_id", 
      { 
        replacements: { evento_id: eventoId }, 
        type: QueryTypes.SELECT 
      }
    );
    return objs;
  }

  // Novo método para gerar o certificado HTML
  static async gerarCertificado(certificadoId) {
    try {
      if (!certificadoId) {
        throw new Error("ID do certificado não informado");
      }
      
      // Buscar os dados do certificado com relacionamentos
      const certificado = await Certificado.findByPk(certificadoId, {
        include: [
          { model: Participante, as: 'participante' },
          { model: Evento, as: 'evento' }
        ]
      });

      if (!certificado) {
        throw new Error("Certificado não encontrado");
      }

      // Criar diretório de certificados se não existir
      const certificadosDir = path.join(process.cwd(), 'public', 'certificados');
      if (!fs.existsSync(certificadosDir)) {
        fs.mkdirSync(certificadosDir, { recursive: true });
      }

      // Gerar nome do arquivo
      const fileName = `certificado_${certificadoId}.html`;
      const filePath = path.join(certificadosDir, fileName);
      
      // URL para acesso via navegador
      const fileUrl = `/certificados/${fileName}`;

      // Gerar HTML do certificado
      const html = this.gerarHTMLCertificado(certificado);

      // Salvar o HTML como arquivo
      fs.writeFileSync(filePath, html);

      // Atualizar o caminho do certificado no banco
      certificado.arquivo_path = fileUrl;
      await certificado.save();

      return fileUrl;
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
      throw new Error("Erro ao gerar certificado: " + error.message);
    }
  }

  // Método que gera o HTML do certificado
  static gerarHTMLCertificado(certificado) {
    try {
      if (!certificado || !certificado.participante || !certificado.evento) {
        throw new Error("Dados do certificado incompletos");
      }
      
      const { participante, evento } = certificado;
      const dataEvento = new Date(evento.data).toLocaleDateString('pt-BR');
      const dataEmissao = new Date(certificado.data_emissao).toLocaleDateString('pt-BR');

      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado - ${participante.nome}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .certificado-container {
      width: 1000px;
      height: 700px;
      margin: 20px auto;
      background-color: white;
      background-image: url('/assets/fundo_certificado.jpg');
      background-size: cover;
      background-position: center;
      border: 10px solid #d4af37;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      padding: 40px;
      text-align: center;
      position: relative;
      color: #333;
    }
    .certificado-titulo {
      font-size: 48px;
      color: #333;
      margin-top: 40px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .certificado-subtitulo {
      font-size: 24px;
      margin: 20px 0;
    }
    .certificado-nome {
      font-size: 36px;
      margin: 30px 0;
      font-weight: bold;
      color: #000;
    }
    .certificado-texto {
      font-size: 20px;
      margin: 20px 60px;
      line-height: 1.5;
    }
    .certificado-descricao {
      font-size: 18px;
      font-style: italic;
      margin: 30px 80px;
    }
    .certificado-footer {
      position: absolute;
      bottom: 80px;
      width: 100%;
      left: 0;
      text-align: center;
    }
    .certificado-assinatura {
      margin: 20px auto;
      width: 200px;
      border-bottom: 2px solid #333;
      padding-bottom: 5px;
      font-weight: bold;
    }
    .certificado-cargo {
      font-size: 16px;
    }
    .certificado-validacao {
      position: absolute;
      bottom: 20px;
      right: 40px;
      font-size: 12px;
    }
    .certificado-data {
      position: absolute;
      bottom: 20px;
      left: 40px;
      font-size: 12px;
    }
    @media print {
      body {
        background-color: white;
      }
      .certificado-container {
        box-shadow: none;
        border: none;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
      }
      .botoes-controle {
        display: none;
      }
    }
    .botoes-controle {
      text-align: center;
      margin: 20px;
    }
    .botao {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin: 0 5px;
    }
    .botao:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="botoes-controle">
    <button class="botao" onclick="window.print()">Imprimir / Salvar PDF</button>
    <button class="botao" onclick="window.history.back()">Voltar</button>
  </div>

  <div class="certificado-container">
    <div class="certificado-titulo">Certificado</div>
    <div class="certificado-subtitulo">DE ${certificado.tipo_certificado.toUpperCase()}</div>
    
    <div class="certificado-nome">${participante.nome}</div>
    
    <div class="certificado-texto">
      Certificamos que o participante acima concluiu com sucesso o evento 
      <strong>"${evento.nome}"</strong> realizado em ${dataEvento}.
    </div>
    
    <div class="certificado-descricao">
      ${certificado.descricao}
    </div>
    
    <div class="certificado-footer">
      <div class="certificado-assinatura">Prof. Dr. João Silva</div>
      <div class="certificado-cargo">Diretor do Evento</div>
    </div>
    
    <div class="certificado-validacao">
      Código de validação: ${certificado.cod_validacao}
    </div>
    
    <div class="certificado-data">
      Emitido em: ${dataEmissao}
    </div>
  </div>
</body>
</html>`;
    } catch (error) {
      console.error("Erro ao gerar HTML do certificado:", error);
      throw new Error("Erro ao gerar HTML do certificado: " + error.message);
    }
  }
}

export { CertificadoService };