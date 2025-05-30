import { Local } from "../models/Local.js";
import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

//PEDRO GOMES
class LocalService {
  
// Método existente findAll
  static async findAll(req, res) {
    const objs = await Local.findAll();
    return objs;
  }

  // Novo método para listar quantidade de eventos por local
  static async findEventosPorLocal() {
    const eventosLocal = await sequelize.query(
      `SELECT locais.id, locais.nome, locais.cidade, locais.uf, locais.bairro, locais.lotacao,
              COUNT(eventos.id) AS quantidade_eventos
      FROM locais
      LEFT JOIN eventos ON locais.id = eventos.local_id
      GROUP BY locais.id, locais.nome, locais.cidade, locais.uf, locais.bairro, locais.lotacao
      ORDER BY quantidade_eventos DESC, locais.nome ASC`,
      { type: QueryTypes.SELECT }
    );
    return eventosLocal;
  }

  // Novo método para listar eventos de um local específico
  static async findEventosByLocalId(req) {
    const { id } = req.params;
    const eventos = await sequelize.query(
      `SELECT eventos.id, eventos.nome, eventos.data,
              locais.nome AS local_nome, locais.cidade, locais.uf
      FROM eventos
      INNER JOIN locais ON eventos.local_id = locais.id
      WHERE locais.id = :id
      ORDER BY eventos.data DESC`,
      { 
        replacements: { id },
        type: QueryTypes.SELECT 
      }
    );
    return eventos;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Local.findByPk(id);
    return obj;
  }

  static async create(req, res) {
    const { nome, uf, cidade, bairro, lotacao } = req.body;
  
    let errors = [];
  
    const objByNome = await Local.findAll({where : {nome: nome}});
    if (objByNome.length == 1) {
      errors.push("Já existe um Local com este nome");
    }
    
    const ufRegex = /^[A-Z]{2}$/;
    if (!ufRegex.test(uf)) {
      errors.push("UF deve ser válida (2 letras)");
    }
    
    if (!cidade || cidade.length < 2) {
      errors.push("Nome da cidade deve ter pelo menos 2 caracteres");
    }
    
    if (!bairro || bairro.length < 2) {
      errors.push("Nome do bairro deve ter pelo menos 2 caracteres");
    }
    
    if (lotacao < 500) {
      errors.push("Lotação deve ser no mínimo 500");
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  
    const obj = await Local.create({ nome, uf, cidade, bairro, lotacao });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, uf, cidade, bairro, lotacao } = req.body;
    var obj = await Local.findOne({ where: { id: id } });
    Object.assign(obj, { nome, uf, cidade, bairro, lotacao });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Local.findByPk(id);
    if (!obj) {
      throw new Error("Local não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este local");
    }
  }
}

export { LocalService };
