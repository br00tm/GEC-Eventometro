import { Funcionario } from "../models/Funcionario.js";
import sequelize from "../config/database.js";
import { QueryTypes } from "sequelize";

//MATEUS DE ANGELI
class FuncionarioService {
  
  static async findAll(req, res) {
    const objs = await Funcionario.findAll();
    return objs;
  }

  static async findFuncionariosPorEvento(req) {
    const { eventoId } = req.query;
    
    let query = `
      SELECT DISTINCT funcionarios.id, funcionarios.nome, 
            funcionarios.cargo, funcionarios.matricula,
            funcionarios.carga_horaria,
            eventos.nome AS evento_nome, eventos.data AS evento_data
      FROM funcionarios
      INNER JOIN evento_funcionario ON funcionarios.id = evento_funcionario.funcionarioId
      INNER JOIN eventos ON evento_funcionario.eventoId = eventos.id
      WHERE 1=1`;
    
    const replacements = {};
    
    if (eventoId) {
      query += " AND eventos.id = :eventoId";
      replacements.eventoId = eventoId;
    }
    
    query += " ORDER BY funcionarios.nome ASC";
    
    const funcionarios = await sequelize.query(query, { 
      replacements,
      type: QueryTypes.SELECT 
    });
    
    return funcionarios;
  }

  static async findResumoFuncionariosParticipacao() {
    const resumo = await sequelize.query(
      `SELECT funcionarios.id, funcionarios.nome, funcionarios.cargo,
              COUNT(DISTINCT evento_funcionario.eventoId) AS total_eventos
      FROM funcionarios
      LEFT JOIN evento_funcionario ON funcionarios.id = evento_funcionario.funcionarioId
      GROUP BY funcionarios.id, funcionarios.nome, funcionarios.cargo
      ORDER BY total_eventos DESC, funcionarios.nome ASC`,
      { type: QueryTypes.SELECT }
    );
    
    return resumo;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id);
    return obj;
  }

  static async create(req, res) {
    const { nome, cargo, matricula, carga_horaria } = req.body;

    let errors = [];

    const funcionarioExistente = await Funcionario.findOne({ where: { matricula: matricula } });
    if (funcionarioExistente) {
      errors.push("Já existe um funcionário cadastrado com esta matrícula");
    }
    
    if (carga_horaria < 0) {
      errors.push("A carga horária não pode ser negativa");
    }
    
    if (!nome || nome.length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    if (!cargo || cargo.length < 2) {
      errors.push("Cargo não pode ser vazio");
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }

    const obj = await Funcionario.create({ nome, cargo, matricula, carga_horaria });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, cargo, matricula, carga_horaria } = req.body;
    
    var obj = await Funcionario.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Funcionário não encontrado");
    }
    
    if (matricula !== obj.matricula) {
      const funcionarioExistente = await Funcionario.findOne({ where: { matricula: matricula } });
      if (funcionarioExistente) {
        throw new Error("Já existe um funcionário cadastrado com esta matrícula");
      }
    }
    
    if (carga_horaria < 0) {
      throw new Error("A carga horária não pode ser negativa");
    }
    
    Object.assign(obj, { nome, cargo, matricula, carga_horaria });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id);
    if (!obj) {
      throw new Error("Funcionário não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este funcionário");
    }
  }
}

export { FuncionarioService };