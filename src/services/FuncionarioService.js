import { Funcionario } from "../models/Funcionario.js";
import sequelize from "../config/database-connection.js";
import { QueryTypes } from "sequelize";

class FuncionarioService {
  
  static async findAll(req, res) {
    const objs = await Funcionario.findAll();
    return objs;
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

  // Relatórios
  
  static async findFuncionariosPorEvento(req) {
    const { eventoId } = req.query;
    
    if (!eventoId) {
      return await this.findAll();
    }
    
    try {
      // Consulta simplificada para encontrar funcionários por evento
      const query = `
        SELECT f.id, f.nome, f.cargo, f.matricula, f.carga_horaria
        FROM funcionarios f
        JOIN evento_funcionario ef ON f.id = ef.funcionario_id
        WHERE ef.evento_id = :eventoId
        ORDER BY f.nome ASC
      `;
      
      const funcionarios = await sequelize.query(query, {
        replacements: { eventoId },
        type: QueryTypes.SELECT
      });
      
      return funcionarios;
    } catch (error) {
      console.error("Erro ao buscar funcionários por evento:", error);
      throw new Error("Não foi possível consultar os funcionários por evento");
    }
  }

  static async findResumoFuncionariosParticipacao() {
    try {
      // Consulta simplificada para encontrar o resumo de participação dos funcionários
      const query = `
        SELECT f.id, f.nome, f.cargo,
               COUNT(DISTINCT ef.evento_id) AS total_eventos
        FROM funcionarios f
        LEFT JOIN evento_funcionario ef ON f.id = ef.funcionario_id
        GROUP BY f.id, f.nome, f.cargo
        ORDER BY total_eventos DESC, f.nome ASC
      `;
      
      const resumo = await sequelize.query(query, { type: QueryTypes.SELECT });
      return resumo;
    } catch (error) {
      console.error("Erro ao buscar resumo de participação dos funcionários:", error);
      throw new Error("Não foi possível obter o resumo de participação dos funcionários");
    }
  }
}

export { FuncionarioService };