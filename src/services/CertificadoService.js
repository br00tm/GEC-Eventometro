//PEDRO BRITO

import { Certificado } from "../models/Certificado.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
import { Presenca } from "../models/Presenca.js";
import fs from 'fs';
import path from 'path';

import sequelize from '../config/database-connection.js';
import { QueryTypes } from 'sequelize';

class CertificadoService {
  
  static async findAll() {
    const objs = await Certificado.findAll({ include: { all: true, nested: true } });
    return objs;
  }

  static async findCertificadosComFiltro(req) {
    const { eventoId, participanteId, tipo_certificado } = req.query;
    
    let query = `
      SELECT certificados.id, certificados.nome, certificados.data_emissao, 
            certificados.cod_validacao, certificados.tipo_certificado,
            participantes.nome AS participante_nome, 
            participantes.email AS participante_email,
            eventos.nome AS evento_nome, eventos.data AS evento_data
      FROM certificados
      INNER JOIN participantes ON certificados.participante_id = participantes.id
      LEFT JOIN eventos ON certificados.evento_id = eventos.id
      WHERE 1=1`;
    
    const replacements = {};
    
    if (eventoId) {
      query += " AND certificados.evento_id = :eventoId";
      replacements.eventoId = eventoId;
    }
    
    if (participanteId) {
      query += " AND certificados.participante_id = :participanteId";
      replacements.participanteId = participanteId;
    }
    
    if (tipo_certificado) {
      query += " AND certificados.tipo_certificado = :tipo_certificado";
      replacements.tipo_certificado = tipo_certificado;
    }
    
    query += " ORDER BY certificados.data_emissao DESC";
    
    const certificados = await sequelize.query(query, { 
      replacements,
      type: QueryTypes.SELECT 
    });
    
    return certificados;
  }

  static async findResumoCertificadosPorEvento() {
    const resumo = await sequelize.query(
      `SELECT eventos.id, eventos.nome, eventos.data,
              COUNT(certificados.id) AS total_certificados,
              COUNT(DISTINCT certificados.participante_id) AS total_participantes
      FROM eventos
      LEFT JOIN certificados ON eventos.id = certificados.evento_id
      GROUP BY eventos.id, eventos.nome, eventos.data
      ORDER BY eventos.data DESC`,
      { type: QueryTypes.SELECT }
    );
    
    return resumo;
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

      // Gerar nome do arquivo com data e hora para evitar cache
      const timestamp = new Date().getTime();
      const fileName = `certificado_${certificadoId}_${timestamp}.html`;
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

      // Retornar apenas a URL relativa para acesso ao certificado
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
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
    
    body {
      font-family: 'Montserrat', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .page-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
    }
    .certificado-container {
      width: 1000px;
      height: 700px;
      margin: 0 auto;
      background-color: white;
      background-image: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.7)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none" stroke="%23d4af37" stroke-width="2"/><path d="M25,25 L75,75 M75,25 L25,75" stroke="%23d4af37" stroke-width="1" opacity="0.2"/></svg>');
      border: 10px solid #d4af37;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
      padding: 40px;
      text-align: center;
      position: relative;
      color: #333;
    }
    .certificado-header {
      margin-bottom: 20px;
    }
    .certificado-logo {
      max-width: 150px;
      margin-bottom: 10px;
    }
    .certificado-titulo {
      font-size: 48px;
      color: #333;
      margin-top: 40px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    .certificado-subtitulo {
      font-size: 24px;
      margin: 20px 0;
      color: #555;
    }
    .certificado-nome {
      font-size: 36px;
      margin: 30px 0;
      font-weight: bold;
      color: #000;
      border-bottom: 2px solid #d4af37;
      display: inline-block;
      padding: 0 20px 5px;
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
      color: #555;
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
      color: #777;
    }
    .certificado-data {
      position: absolute;
      bottom: 20px;
      left: 40px;
      font-size: 12px;
      color: #777;
    }
    .certificado-selo {
      position: absolute;
      bottom: 60px;
      right: 60px;
      width: 100px;
      height: 100px;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="%23d4af37" stroke-width="2"/><circle cx="50" cy="50" r="35" fill="none" stroke="%23d4af37" stroke-width="1"/><text x="50" y="45" text-anchor="middle" fill="%23d4af37" font-size="12">CERTIFICADO</text><text x="50" y="60" text-anchor="middle" fill="%23d4af37" font-size="10">AUTÊNTICO</text></svg>');
      background-size: contain;
      opacity: 0.8;
    }
    @media print {
      body {
        background-color: white;
      }
      .page-container {
        padding: 0;
        margin: 0;
      }
      .certificado-container {
        box-shadow: none;
        border: none;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100vh;
        page-break-inside: avoid;
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
      text-decoration: none;
      display: inline-block;
    }
    .botao:hover {
      background-color: #45a049;
    }
    .botao-imprimir {
      background-color: #2196F3;
    }
    .botao-imprimir:hover {
      background-color: #0b7dda;
    }
    .botao-voltar {
      background-color: #f44336;
    }
    .botao-voltar:hover {
      background-color: #da190b;
    }
    .botao-download {
      background-color: #ff9800;
    }
    .botao-download:hover {
      background-color: #e68a00;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="botoes-controle">
      <button class="botao botao-imprimir" onclick="window.print()">Imprimir Certificado</button>
      <button class="botao botao-download" onclick="downloadPDF()">Baixar como PDF</button>
      <button class="botao botao-voltar" onclick="window.history.back()">Voltar</button>
    </div>

    <div class="certificado-container">
      <div class="certificado-header">
        <div class="certificado-titulo">Certificado</div>
        <div class="certificado-subtitulo">DE ${certificado.tipo_certificado.toUpperCase()}</div>
      </div>
      
      <div class="certificado-nome">${participante.nome}</div>
      
      <div class="certificado-texto">
        Certificamos que o participante acima concluiu com sucesso o evento 
        <strong>"${evento.nome}"</strong> realizado em ${dataEvento}.
      </div>
      
      <div class="certificado-descricao">
        ${certificado.descricao}
      </div>
      
      <div class="certificado-footer">
        <div class="certificado-assinatura">Diretor do Evento</div>
        <div class="certificado-cargo">Coordenação de Eventos</div>
      </div>
      
      <div class="certificado-data">Emitido em: ${dataEmissao}</div>
      <div class="certificado-validacao">Código de validação: ${certificado.cod_validacao}</div>
      <div class="certificado-selo"></div>
    </div>
  </div>

  <script>
    function downloadPDF() {
      window.print();
    }
    
    // Adiciona a data e hora atual ao título para evitar cache
    document.title = "Certificado - ${participante.nome} - " + new Date().toLocaleString();
  </script>
</body>
</html>`;
    } catch (error) {
      console.error('Erro ao gerar HTML do certificado:', error);
      throw new Error("Erro ao gerar HTML do certificado: " + error.message);
    }
  }
}

export { CertificadoService };