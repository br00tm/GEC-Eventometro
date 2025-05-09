//PEDRO GOMES

import { Presenca } from "../models/Presenca.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

//MATEUS DE ANGELI
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
    
    // Verificar regras de negócio antes de criar a presença
    if (await this.verificarRegrasDeNegocio(req)) {
      // Validação: formato do horário (HH:MM)
      const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horarioRegex.test(horario)) {
        throw new Error("Horário deve estar no formato HH:MM");
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
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { data, horario, tipo_presenca, modo_registro, participante_id, evento_id } = req.body;
    
    // Validação: presença existe?
    const obj = await Presenca.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Presença não encontrada");
    }
    
    // Verificar regras de negócio para atualização
    if (await this.verificarRegrasDeNegocioUpdate(req, obj)) {
      // Validação: formato do horário (HH:MM)
      const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horarioRegex.test(horario)) {
        throw new Error("Horário deve estar no formato HH:MM");
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
    const { data, participante_id, evento_id } = req.body;

    // Regra de Negócio 1: Usuário não poderá ter mais de uma presença em um evento
    const presencaExistente = await this.findByParticipanteAndEvento(participante_id, evento_id);
    if (presencaExistente.length > 0) {
      throw new Error("Este participante já possui presença registrada neste evento");
    }

    // Regra de Negócio 2: Só pode cadastrar presença no mesmo dia do evento
    const eventoInfo = await sequelize.query(
      "SELECT * FROM eventos WHERE id = :eventoId",
      {
        replacements: { eventoId: evento_id },
        type: QueryTypes.SELECT
      }
    );
    
    if (eventoInfo.length === 0) {
      throw new Error("Evento não encontrado");
    }
    
    const dataEvento = eventoInfo[0].data;
    if (data !== dataEvento) {
      throw new Error("Só é possível registrar presença no mesmo dia do evento");
    }

    // Regra de Negócio 3: Um usuário não pode registrar presença em dois eventos no mesmo dia
    const presencasNaData = await this.findByParticipanteAndData(participante_id, data);
    if (presencasNaData.length > 0) {
      throw new Error("Este participante já possui presença registrada em outro evento neste dia");
    }

    // Se chegou até aqui, todas as regras foram satisfeitas
    return true;
  }
  
  // Método específico para validar na atualização
  static async verificarRegrasDeNegocioUpdate(req, presencaAtual) {
    const { data, participante_id, evento_id } = req.body;
    
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
        throw new Error("Este participante já possui presença registrada neste evento");
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
      throw new Error("Evento não encontrado");
    }
    
    const dataEvento = eventoInfo[0].data;
    if (data !== dataEvento) {
      throw new Error("Só é possível registrar presença no mesmo dia do evento");
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
      throw new Error("Este participante já possui presença registrada em outro evento neste dia");
    }
    
    // Se chegou até aqui, todas as regras foram satisfeitas
    return true;
  }
}

export { PresencaService };