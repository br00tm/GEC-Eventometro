//MATEUS DE ANGELI

import { Avaliacao } from "../models/Avaliacao.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
import { Presenca } from "../models/Presenca.js";
import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

//PEDRO GOMES
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

    // Verificar regras de negócio antes de criar a avaliação
    if (await this.verificarRegrasDeNegocio(req)) {
      // Validação adicional: nota entre 0 e 5
      if (nota < 0 || nota > 5) {
        throw new Error("A nota deve estar entre 0 e 5");
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
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nota, comentarios, data_avaliacao, participante, participante_id, evento_id } = req.body;
    
    // Buscar a avaliação existente
    const obj = await Avaliacao.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Avaliação não encontrada");
    }
    
    // Verificar regras de negócio para atualização
    if (await this.verificarRegrasDeNegocioUpdate(req, obj)) {
      // Validação adicional: nota entre 0 e 5
      if (nota < 0 || nota > 5) {
        throw new Error("A nota deve estar entre 0 e 5");
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

    // Regra de Negócio 1: Participante só pode fazer uma avaliação para cada evento
    const avaliacaoExistente = await this.findByParticipanteAndEvento(participante_id, evento_id);
    if (avaliacaoExistente.length > 0) {
      throw new Error("Este participante já avaliou este evento");
    }

    // Regra de Negócio 2: Participante só pode fazer avaliação para um evento que possui presença
    const temPresenca = await this.verificarPresenca(participante_id, evento_id);
    if (!temPresenca) {
      throw new Error("O participante precisa ter presença no evento para avaliá-lo");
    }

    // Regra de Negócio 3: Caso a nota seja 1 ou 5, a descrição deverá ser obrigatória
    if ((nota === 1 || nota === 5) && (!comentarios || comentarios.trim() === "")) {
      throw new Error("Para notas 1 ou 5, é obrigatório incluir comentários");
    }

    // Se chegou até aqui, todas as regras foram satisfeitas
    return true;
  }
  
  // Método específico para validar na atualização
  static async verificarRegrasDeNegocioUpdate(req, avaliacaoAtual) {
    const { nota, comentarios, participante_id, evento_id } = req.body;
    
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
        throw new Error("Este participante já avaliou este evento");
      }
      
      // Regra 2: Participante só pode fazer avaliação para um evento que possui presença
      const temPresenca = await this.verificarPresenca(participante_id, evento_id);
      if (!temPresenca) {
        throw new Error("O participante precisa ter presença no evento para avaliá-lo");
      }
    }
    
    // Regra 3: Caso a nota seja 1 ou 5, a descrição deverá ser obrigatória
    if ((nota === 1 || nota === 5) && (!comentarios || comentarios.trim() === "")) {
      throw new Error("Para notas 1 ou 5, é obrigatório incluir comentários");
    }
    
    // Se chegou até aqui, todas as regras foram satisfeitas
    return true;
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