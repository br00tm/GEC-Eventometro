//PEDRO GOMES

import { Avaliacao } from "../models/Avaliacao.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
import { Presenca } from "../models/Presenca.js";
import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';


class AvaliacaoService {
  
  static async findAll(req, res) {
    const objs = await Avaliacao.findAll({
      include: [
        { model: Participante, as: 'participante_obj' },
        { model: Evento, as: 'evento' }
      ]
    });
    return objs;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Avaliacao.findByPk(id, {
      include: [
        { model: Participante, as: 'participante_obj' },
        { model: Evento, as: 'evento' }
      ]
    });
    return obj;
  }

  static async create(req, res) {
    const { nota, comentarios, data_avaliacao, participante, participante_id, evento_id } = req.body;
    const errors = [];

    // Validações básicas
    if (!nota && nota !== 0) {
      errors.push("A nota é obrigatória");
    } else if (nota < 0 || nota > 5) {
      errors.push("A nota deve estar entre 0 e 5");
    }

    if (!data_avaliacao) {
      errors.push("A data de avaliação é obrigatória");
    } else {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(data_avaliacao)) {
        errors.push("Data de avaliação deve seguir o formato yyyy-MM-dd");
      }
    }

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
      // Verificar regras de negócio
      const regrasErrors = await this.verificarRegrasDeNegocio(req);
      if (regrasErrors.length > 0) {
        throw new Error(regrasErrors.join("; "));
      }

      const t = await sequelize.transaction();
      try {
        const obj = await Avaliacao.create({ 
          nota, 
          comentarios, 
          data_avaliacao, 
          participante,
          participante_id,
          evento_id
        }, { transaction: t });
        
        await t.commit();
        return await Avaliacao.findByPk(obj.id, {
          include: [
            { model: Participante, as: 'participante_obj' },
            { model: Evento, as: 'evento' }
          ]
        });
      } catch (error) {
        await t.rollback();
        throw new Error("Erro ao criar avaliação: " + error.message);
      }
    } catch (error) {
      throw error;
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nota, comentarios, data_avaliacao, participante, participante_id, evento_id } = req.body;
    const errors = [];
    
    // Validações básicas
    if (!nota && nota !== 0) {
      errors.push("A nota é obrigatória");
    } else if (nota < 0 || nota > 5) {
      errors.push("A nota deve estar entre 0 e 5");
    }

    if (!data_avaliacao) {
      errors.push("A data de avaliação é obrigatória");
    } else {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(data_avaliacao)) {
        errors.push("Data de avaliação deve seguir o formato yyyy-MM-dd");
      }
    }

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
      // Buscar a avaliação existente
      const obj = await Avaliacao.findOne({ where: { id: id } });
      if (!obj) {
        throw new Error("Avaliação não encontrada");
      }
      
      // Verificar regras de negócio para atualização
      const regrasErrors = await this.verificarRegrasDeNegocioUpdate(req, obj);
      if (regrasErrors.length > 0) {
        throw new Error(regrasErrors.join("; "));
      }
      
      const t = await sequelize.transaction();
      try {
        Object.assign(obj, { 
          nota, 
          comentarios, 
          data_avaliacao, 
          participante,
          participante_id,
          evento_id
        });
        
        await obj.save({ transaction: t });
        await t.commit();
        return await Avaliacao.findByPk(obj.id, {
          include: [
            { model: Participante, as: 'participante_obj' },
            { model: Evento, as: 'evento' }
          ]
        });
      } catch (error) {
        await t.rollback();
        throw new Error("Erro ao atualizar avaliação: " + error.message);
      }
    } catch (error) {
      throw error;
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Avaliacao.findByPk(id);
    if (!obj) {
      throw new Error("Avaliação não encontrada");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover esta avaliação");
    }
  }
  
  // Método para verificar avaliação por participante e evento usando SQL direto
  static async findByParticipanteAndEvento(participanteId, eventoId) {
    const avaliacoes = await sequelize.query(
      "SELECT * FROM avaliacoes WHERE participante_id = :participanteId AND evento_id = :eventoId",
      {
        replacements: { participanteId, eventoId },
        type: QueryTypes.SELECT
      }
    );
    return avaliacoes;
  }
  
  // Método para verificar presença por participante e evento
  static async verificarPresenca(participanteId, eventoId) {
    const presencas = await sequelize.query(
      "SELECT * FROM presencas WHERE participante_id = :participanteId AND evento_id = :eventoId",
      {
        replacements: { participanteId, eventoId },
        type: QueryTypes.SELECT
      }
    );
    return presencas.length > 0;
  }
  
  // Implementando as regras de negócio relacionadas ao processo de avaliação
  // Regra de Negócio 1: Participante só pode fazer uma avaliação para cada evento
  // Regra de Negócio 2: Participante só pode fazer avaliação para um evento que possui presença
  // Regra de Negócio 3: Caso a nota seja 1 ou 5, a descrição deverá ser obrigatória
  static async verificarRegrasDeNegocio(req) {
    const { nota, comentarios, participante_id, evento_id } = req.body;
    const errors = [];

    try {
      // Regra de Negócio 1: Participante só pode fazer uma avaliação para cada evento
      const avaliacaoExistente = await this.findByParticipanteAndEvento(participante_id, evento_id);
      if (avaliacaoExistente.length > 0) {
        errors.push("Este participante já avaliou este evento");
      }

      // Regra de Negócio 2: Participante só pode fazer avaliação para um evento que possui presença
      const temPresenca = await this.verificarPresenca(participante_id, evento_id);
      if (!temPresenca) {
        errors.push("O participante precisa ter presença no evento para avaliá-lo");
      }

      // Regra de Negócio 3: Caso a nota seja 1 ou 5, a descrição deverá ser obrigatória
      if ((nota === 1 || nota === 5) && (!comentarios || comentarios.trim() === "")) {
        errors.push("Para notas 1 ou 5, é obrigatório incluir comentários");
      }
    } catch (error) {
      errors.push("Erro ao verificar regras de negócio: " + error.message);
    }

    return errors;
  }
  
  // Método específico para validar na atualização
  static async verificarRegrasDeNegocioUpdate(req, avaliacaoAtual) {
    const { nota, comentarios, participante_id, evento_id } = req.body;
    const errors = [];
    
    try {
      // Regra 1: Participante só pode fazer uma avaliação para cada evento (exceto a atual)
      if (participante_id != avaliacaoAtual.participante_id || evento_id != avaliacaoAtual.evento_id) {
        const avaliacaoExistente = await sequelize.query(
          "SELECT * FROM avaliacoes WHERE participante_id = :participanteId AND evento_id = :eventoId AND id != :avaliacaoId",
          {
            replacements: { 
              participanteId: participante_id, 
              eventoId: evento_id,
              avaliacaoId: avaliacaoAtual.id
            },
            type: QueryTypes.SELECT
          }
        );
        
        if (avaliacaoExistente.length > 0) {
          errors.push("Este participante já avaliou este evento");
        }
        
        // Regra 2: Participante só pode fazer avaliação para um evento que possui presença
        const temPresenca = await this.verificarPresenca(participante_id, evento_id);
        if (!temPresenca) {
          errors.push("O participante precisa ter presença no evento para avaliá-lo");
        }
      }
      
      // Regra 3: Caso a nota seja 1 ou 5, a descrição deverá ser obrigatória
      if ((nota === 1 || nota === 5) && (!comentarios || comentarios.trim() === "")) {
        errors.push("Para notas 1 ou 5, é obrigatório incluir comentários");
      }
    } catch (error) {
      errors.push("Erro ao verificar regras de negócio: " + error.message);
    }
    
    return errors;
  }
  
  // Método auxiliar para buscar avaliações por evento
  static async findByEvento(eventoId) {
    const avaliacoes = await sequelize.query(
      "SELECT a.*, p.nome as participante_nome FROM avaliacoes a " +
      "JOIN participantes p ON a.participante_id = p.id " +
      "WHERE a.evento_id = :eventoId",
      {
        replacements: { eventoId },
        type: QueryTypes.SELECT
      }
    );
    return avaliacoes;
  }
  
  // Método auxiliar para buscar avaliações por participante
  static async findByParticipante(participanteId) {
    const avaliacoes = await sequelize.query(
      "SELECT a.*, e.nome as evento_nome FROM avaliacoes a " +
      "JOIN eventos e ON a.evento_id = e.id " +
      "WHERE a.participante_id = :participanteId",
      {
        replacements: { participanteId },
        type: QueryTypes.SELECT
      }
    );
    return avaliacoes;
  }
}

export { AvaliacaoService };