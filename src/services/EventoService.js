import { Evento } from "../models/Evento.js";
import { Local } from "../models/Local.js";
import  sequelize  from "../config/database.js";
import { QueryTypes } from "sequelize";

//PEDRO GOMES
class EventoService {
  
  static async findAll(req, res) {
    const objs = await Evento.findAll({
      include: [
        { model: Local, as: 'local' }
      ]
    });
    return objs;
  }

  static async findEventosPorPeriodo(req) {
    const { inicio, termino } = req.query;
    
    let query = `
      SELECT eventos.id, eventos.nome, eventos.data, 
            locais.nome AS local_nome, locais.cidade, locais.lotacao,
            COUNT(DISTINCT evento_palestrante.palestranteId) AS num_palestrantes,
            COUNT(DISTINCT evento_patrocinador.patrocinadorId) AS num_patrocinadores
      FROM eventos
      LEFT JOIN locais ON eventos.local_id = locais.id
      LEFT JOIN evento_palestrante ON eventos.id = evento_palestrante.eventoId
      LEFT JOIN evento_patrocinador ON eventos.id = evento_patrocinador.eventoId
      WHERE 1=1`;
    
    const replacements = {};
    
    if (inicio) {
      query += " AND eventos.data >= :inicio";
      replacements.inicio = inicio;
    }
    
    if (termino) {
      query += " AND eventos.data <= :termino";
      replacements.termino = termino;
    }
    
    query += " GROUP BY eventos.id, eventos.nome, eventos.data, locais.nome, locais.cidade, locais.lotacao";
    query += " ORDER BY eventos.data DESC";
    
    const eventos = await sequelize.query(query, { 
      replacements,
      type: QueryTypes.SELECT 
    });
    
    return eventos;
  }

  static async findEventosComEstatisticas() {
    const eventos = await sequelize.query(
      `SELECT eventos.id, eventos.nome, eventos.data, 
              locais.nome AS local_nome, locais.cidade, locais.lotacao,
              COUNT(DISTINCT evento_palestrante.palestranteId) AS num_palestrantes,
              COUNT(DISTINCT evento_patrocinador.patrocinadorId) AS num_patrocinadores,
              COUNT(DISTINCT certificados.id) AS num_certificados,
              COUNT(DISTINCT presencas.id) AS num_presencas
      FROM eventos
      LEFT JOIN locais ON eventos.local_id = locais.id
      LEFT JOIN evento_palestrante ON eventos.id = evento_palestrante.eventoId
      LEFT JOIN evento_patrocinador ON eventos.id = evento_patrocinador.eventoId
      LEFT JOIN certificados ON eventos.id = certificados.evento_id
      LEFT JOIN presencas ON eventos.id = presencas.evento_id
      GROUP BY eventos.id, eventos.nome, eventos.data, locais.nome, locais.cidade, locais.lotacao
      ORDER BY eventos.data DESC`,
      { type: QueryTypes.SELECT }
    );
    
    return eventos;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Evento.findByPk(id, {
      include: [
        { model: Local, as: 'local' }
      ]
    });
    return obj;
  }

  static async create(req, res) {
    const { nome, data, local_id } = req.body;
  
    let errors = [];
  
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dataRegex.test(data)) {
      errors.push("Data do Evento deve seguir o padrão yyyy-MM-dd");
    }
  
    const objDuplicado = await Evento.findAll({
      where: {
        nome: nome,
        data: data
      }
    });
    
    if (objDuplicado.length > 0) {
      errors.push("Já existe um Evento com este nome nesta data");
    }
  
    const localExiste = await Local.findByPk(local_id);
    if (!localExiste) {
      errors.push("Local não encontrado");
    }
  
    if (!nome || nome.length < 3) {
      errors.push("Nome do evento deve ter pelo menos 3 caracteres");
    }
  
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  
    const t = await sequelize.transaction();
    try {
      const obj = await Evento.create({ nome, data, local_id }, { transaction: t });
      await t.commit();
      return await Evento.findByPk(obj.id, { include: { all: true, nested: true }});
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, data, local_id } = req.body;
    
    var obj = await Evento.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Evento não encontrado");
    }
    
    Object.assign(obj, { nome, data, local_id });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Evento.findByPk(id);
    if (!obj) {
      throw new Error("Evento não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este evento");
    }
  }
}

export { EventoService };
