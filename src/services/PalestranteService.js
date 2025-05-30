import { Palestrante } from "../models/Palestrante.js";
import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

//MATEUS DE ANGELI
class PalestranteService {
  
  static async findAll(req, res) {
    const objs = await Palestrante.findAll();
    return objs;
  }

  static async findPalestrantesPorEvento(req) {
    const { eventoId } = req.query;
    
    let query = `
      SELECT DISTINCT palestrantes.id, palestrantes.nome, 
            palestrantes.email, palestrantes.especialidade,
            palestrantes.nome_palestra,
            eventos.nome AS evento_nome, eventos.data AS evento_data
      FROM palestrantes
      INNER JOIN evento_palestrante ON palestrantes.id = evento_palestrante.palestranteId
      INNER JOIN eventos ON evento_palestrante.eventoId = eventos.id
      WHERE 1=1`;
    
    const replacements = {};
    
    if (eventoId) {
      query += " AND eventos.id = :eventoId";
      replacements.eventoId = eventoId;
    }
    
    query += " ORDER BY palestrantes.nome ASC";
    
    const palestrantes = await sequelize.query(query, { 
      replacements,
      type: QueryTypes.SELECT 
    });
    
    return palestrantes;
  }


  static async findResumoPalestrantesParticipacao() {
    const resumo = await sequelize.query(
      `SELECT palestrantes.id, palestrantes.nome, palestrantes.especialidade,
              COUNT(DISTINCT evento_palestrante.eventoId) AS total_eventos
      FROM palestrantes
      LEFT JOIN evento_palestrante ON palestrantes.id = evento_palestrante.palestranteId
      GROUP BY palestrantes.id, palestrantes.nome, palestrantes.especialidade
      ORDER BY total_eventos DESC, palestrantes.nome ASC`,
      { type: QueryTypes.SELECT }
    );
    
    return resumo;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Palestrante.findByPk(id);
    return obj;
  }

  static async create(req, res) {
    const { nome, email, especialidade, nome_palestra } = req.body;
  
    let errors = [];
  
    const palestranteExistente = await Palestrante.findOne({ where: { email: email } });
    if (palestranteExistente) {
      errors.push("Já existe um palestrante cadastrado com este email");
    }
  
    if (!nome || nome.length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
  
    if (!especialidade || especialidade.length < 2) {
      errors.push("Especialidade não pode ser vazia");
    }
  
    if (!nome_palestra || nome_palestra.length < 2) {
      errors.push("Nome da Palestra deve ter entre 2 e 100 letras");
    } else if (nome_palestra.length > 100) {
      errors.push("Nome da Palestra deve ter entre 2 e 100 letras");
    }
  
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  
    const obj = await Palestrante.create({ nome, email, especialidade, nome_palestra });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, email, especialidade, nome_palestra } = req.body;
    
    var obj = await Palestrante.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Palestrante não encontrado");
    }
    
    if (email !== obj.email) {
      const palestranteExistente = await Palestrante.findOne({ where: { email: email } });
      if (palestranteExistente) {
        throw new Error("Já existe um palestrante cadastrado com este email");
      }
    }
    
    Object.assign(obj, { nome, email, especialidade, nome_palestra });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Palestrante.findByPk(id);
    if (!obj) {
      throw new Error("Palestrante não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este palestrante");
    }
  }
}

export { PalestranteService };