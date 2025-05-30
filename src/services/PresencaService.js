//MATEUS DE ANGELI

import { Presenca } from "../models/Presenca.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';


class PresencaService {
  
  static async findAll(req, res) {
    const objs = await Presenca.findAll({
      include: [
        { model: Participante, as: 'participante' },
        { model: Evento, as: 'evento' }
      ]
    });
    return objs;
  }

  static async findPresencasComFiltro(req) {
    const { eventoId, data, participanteId } = req.query;
    
    let query = `
      SELECT presencas.id, presencas.data, presencas.horario, 
            presencas.tipo_presenca, presencas.modo_registro,
            participantes.nome AS participante_nome, 
            participantes.email AS participante_email,
            eventos.nome AS evento_nome, eventos.data AS evento_data
      FROM presencas
      INNER JOIN participantes ON presencas.participante_id = participantes.id
      LEFT JOIN eventos ON presencas.evento_id = eventos.id
      WHERE 1=1`;
    
    const replacements = {};
    
    if (eventoId) {
      query += " AND presencas.evento_id = :eventoId";
      replacements.eventoId = eventoId;
    }
    
    if (data) {
      query += " AND presencas.data = :data";
      replacements.data = data;
    }
    
    if (participanteId) {
      query += " AND presencas.participante_id = :participanteId";
      replacements.participanteId = participanteId;
    }
    
    query += " ORDER BY presencas.data DESC, presencas.horario ASC";
    
    const presencas = await sequelize.query(query, { 
      replacements,
      type: QueryTypes.SELECT 
    });
    
    return presencas;
  }

  // Método para resumo de presenças por evento
  static async findResumoPresencasPorEvento() {
    const resumo = await sequelize.query(
      `SELECT eventos.id, eventos.nome, eventos.data,
              COUNT(presencas.id) AS total_presencas,
              COUNT(DISTINCT presencas.participante_id) AS total_participantes
      FROM eventos
      LEFT JOIN presencas ON eventos.id = presencas.evento_id
      GROUP BY eventos.id, eventos.nome, eventos.data
      ORDER BY eventos.data DESC`,
      { type: QueryTypes.SELECT }
    );
    
    return resumo;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Presenca.findByPk(id, {
      include: [
        { model: Participante, as: 'participante' },
        { model: Evento, as: 'evento' }
      ]
    });
    return obj;
  }

  static async create(req, res) {
    const { data, horario, tipo_presenca, modo_registro, participante_id, evento_id } = req.body;
    const errors = [];
    
    // Validações básicas
    // Validação da data
    if (!data) {
      errors.push("A data é obrigatória");
    } else {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(data)) {
        errors.push("Data deve seguir o formato yyyy-MM-dd");
      }
    }

    // Validação do horário
    if (!horario) {
      errors.push("O horário é obrigatório");
    } else {
      const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horarioRegex.test(horario)) {
        errors.push("Horário deve estar no formato HH:MM");
      }
    }

    // Validação do tipo de presença
    if (!tipo_presenca) {
      errors.push("O tipo de presença é obrigatório");
    } else if (!["Entrada", "Saída"].includes(tipo_presenca)) {
      errors.push("O tipo de presença deve ser 'Entrada' ou 'Saída'");
    }

    // Validação do modo de registro
    if (!modo_registro) {
      errors.push("O modo de registro é obrigatório");
    } else if (!["Manual", "Automático", "QRCode"].includes(modo_registro)) {
      errors.push("O modo de registro deve ser 'Manual', 'Automático' ou 'QRCode'");
    }

    // Validação dos IDs
    if (!participante_id) {
      errors.push("ID do participante é obrigatório");
    }

    if (!evento_id) {
      errors.push("ID do evento é obrigatório");
    }

    try {
      // Verificar regras de negócio que envolvem consultas ao banco
      if (errors.length === 0) {
        const regrasErrors = await this.verificarRegrasDeNegocio(req);
        errors.push(...regrasErrors);
      }

      // Se há erros, lança todos juntos
      if (errors.length > 0) {
        throw new Error(errors.join("; "));
      }

      const t = await sequelize.transaction();
      try {
        const obj = await Presenca.create({ 
          data, 
          horario, 
          tipo_presenca, 
          modo_registro,
          participante_id,
          evento_id
        }, { transaction: t });
        
        await t.commit();
        return await Presenca.findByPk(obj.id, {
          include: [
            { model: Participante, as: 'participante' },
            { model: Evento, as: 'evento' }
          ]
        });
      } catch (error) {
        await t.rollback();
        throw new Error("Erro ao registrar presença: " + error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { data, horario, tipo_presenca, modo_registro, participante_id, evento_id } = req.body;
    const errors = [];
    
    // Validações básicas
    // Validação da data
    if (!data) {
      errors.push("A data é obrigatória");
    } else {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(data)) {
        errors.push("Data deve seguir o formato yyyy-MM-dd");
      }
    }

    // Validação do horário
    if (!horario) {
      errors.push("O horário é obrigatório");
    } else {
      const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horarioRegex.test(horario)) {
        errors.push("Horário deve estar no formato HH:MM");
      }
    }

    // Validação do tipo de presença
    if (!tipo_presenca) {
      errors.push("O tipo de presença é obrigatório");
    } else if (!["Entrada", "Saída"].includes(tipo_presenca)) {
      errors.push("O tipo de presença deve ser 'Entrada' ou 'Saída'");
    }

    // Validação do modo de registro
    if (!modo_registro) {
      errors.push("O modo de registro é obrigatório");
    } else if (!["Manual", "Automático", "QRCode"].includes(modo_registro)) {
      errors.push("O modo de registro deve ser 'Manual', 'Automático' ou 'QRCode'");
    }

    // Validação dos IDs
    if (!participante_id) {
      errors.push("ID do participante é obrigatório");
    }

    if (!evento_id) {
      errors.push("ID do evento é obrigatório");
    }

    // Se há erros de validação básica, lança antes de consultar o banco
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }

    try {
      const obj = await Presenca.findByPk(id);
      if (!obj) {
        throw new Error("Presença não encontrada");
      }

      const t = await sequelize.transaction();
      try {
        Object.assign(obj, { 
          data, 
          horario, 
          tipo_presenca, 
          modo_registro,
          participante_id,
          evento_id
        });
        
        await obj.save({ transaction: t });
        await t.commit();
        
        return await Presenca.findByPk(obj.id, {
          include: [
            { model: Participante, as: 'participante' },
            { model: Evento, as: 'evento' }
          ]
        });
      } catch (error) {
        await t.rollback();
        throw new Error("Erro ao atualizar presença: " + error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
}

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Presenca.findByPk(id);
    if (!obj) {
      throw new Error("Presença não encontrada");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover esta presença");
    }
  }
  
  // Método para verificar presença por participante e evento usando SQL direto
  static async findByParticipanteAndEvento(participanteId, eventoId) {
    const presencas = await sequelize.query(
      "SELECT * FROM presencas WHERE participante_id = :participanteId AND evento_id = :eventoId",
      {
        replacements: { participanteId, eventoId },
        type: QueryTypes.SELECT
      }
    );
    return presencas;
  }
  
  // Método para verificar presença por participante em uma data específica
  static async findByParticipanteAndData(participanteId, data) {
    const presencas = await sequelize.query(
      "SELECT p.*, e.nome as evento_nome, e.data as evento_data FROM presencas p " +
      "JOIN eventos e ON p.evento_id = e.id " +
      "WHERE p.participante_id = :participanteId AND p.data = :data",
      {
        replacements: { participanteId, data },
        type: QueryTypes.SELECT
      }
    );
    return presencas;
  }
  
  // Implementando as regras de negócio relacionadas ao processo de registro de presença
  // Regra de Negócio 1: Usuário não poderá ter mais de uma presença em um evento
  // Regra de Negócio 2: Só pode cadastrar presença no mesmo dia do evento
  // Regra de Negócio 3: Um usuário não pode registrar presença em dois eventos no mesmo dia
  static async verificarRegrasDeNegocio(req) {
    const { data, horario, tipo_presenca, participante_id, evento_id } = req.body;
    const errors = [];

    try {
      // Verificar se o participante existe
      const participante = await Participante.findByPk(participante_id);
      if (!participante) {
        errors.push("Participante não encontrado");
      }

      // Verificar se o evento existe
      const evento = await Evento.findByPk(evento_id);
      if (!evento) {
        errors.push("Evento não encontrado");
      }

      // Verificar se já existe uma presença do mesmo tipo no mesmo dia
      const presencaExistente = await Presenca.findOne({
        where: {
          participante_id,
          evento_id,
          data,
          tipo_presenca
        }
      });

      if (presencaExistente) {
        errors.push(`Já existe uma presença do tipo ${tipo_presenca} registrada para este participante neste evento e data`);
      }

      // Verificar se a data da presença é compatível com a data do evento
      if (evento) {
        const dataEvento = new Date(evento.data);
        const dataPresenca = new Date(data);
        
        if (dataPresenca.toISOString().split('T')[0] !== dataEvento.toISOString().split('T')[0]) {
          errors.push("A data da presença deve ser igual à data do evento");
        }
      }

      // Verificar se existe uma entrada antes de registrar uma saída
      if (tipo_presenca === "Saída") {
        const entradaExistente = await Presenca.findOne({
          where: {
            participante_id,
            evento_id,
            data,
            tipo_presenca: "Entrada"
          }
        });

        if (!entradaExistente) {
          errors.push("É necessário registrar uma entrada antes de registrar uma saída");
        } else {
          // Verificar se o horário da saída é posterior ao horário da entrada
          const horaEntrada = entradaExistente.horario.split(':').map(Number);
          const horaSaida = horario.split(':').map(Number);
          
          if (horaSaida[0] < horaEntrada[0] || 
              (horaSaida[0] === horaEntrada[0] && horaSaida[1] <= horaEntrada[1])) {
            errors.push("O horário de saída deve ser posterior ao horário de entrada");
          }
        }
      }

      return errors;
    } catch (error) {
      errors.push("Erro ao verificar regras de negócio: " + error.message);
      return errors;
    }
  }
  
  // Método específico para validar na atualização
  static async verificarRegrasDeNegocioUpdate(req, presencaAtual) {
    const { data, participante_id, evento_id } = req.body;
    const errors = [];
    
    try {
      // Regra 1: Usuário não poderá ter mais de uma presença em um evento (exceto a atual)
      if (participante_id != presencaAtual.participante_id || evento_id != presencaAtual.evento_id) {
        const presencaExistente = await sequelize.query(
          "SELECT * FROM presencas WHERE participante_id = :participanteId AND evento_id = :eventoId AND id != :presencaId",
          {
            replacements: { 
              participanteId: participante_id, 
              eventoId: evento_id,
              presencaId: presencaAtual.id
            },
            type: QueryTypes.SELECT
          }
        );
        
        if (presencaExistente.length > 0) {
          errors.push("Este participante já possui presença registrada neste evento");
        }
      }
      
      // Regra 2: Só pode cadastrar presença no mesmo dia do evento
      const eventoInfo = await sequelize.query(
        "SELECT * FROM eventos WHERE id = :eventoId",
        {
          replacements: { eventoId: evento_id },
          type: QueryTypes.SELECT
        }
      );
      
      if (eventoInfo.length === 0) {
        errors.push("Evento não encontrado");
      } else {
        const dataEvento = eventoInfo[0].data;
        if (data !== dataEvento) {
          errors.push("Só é possível registrar presença no mesmo dia do evento");
        }
      }
      
      // Regra 3: Um usuário não pode registrar presença em dois eventos no mesmo dia (exceto a atual)
      const presencasNaData = await sequelize.query(
        "SELECT p.* FROM presencas p " +
        "WHERE p.participante_id = :participanteId AND p.data = :data AND p.id != :presencaId",
        {
          replacements: { 
            participanteId: participante_id, 
            data: data,
            presencaId: presencaAtual.id
          },
          type: QueryTypes.SELECT
        }
      );
      
      if (presencasNaData.length > 0) {
        errors.push("Este participante já possui presença registrada em outro evento neste dia");
      }
    } catch (error) {
      errors.push("Erro ao verificar regras de negócio: " + error.message);
    }
    
    return errors;
  }
}

export { PresencaService };