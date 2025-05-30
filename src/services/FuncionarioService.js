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
    
    // Tentamos primeiro com snake_case (padrão usado com underscored: true)
    try {
      let query = `
        SELECT DISTINCT funcionarios.id, funcionarios.nome, 
               funcionarios.cargo, funcionarios.matricula,
               funcionarios.carga_horaria,
               eventos.nome AS evento_nome, eventos.data AS evento_data
        FROM funcionarios
        INNER JOIN evento_funcionario ON funcionarios.id = evento_funcionario.funcionario_id
        INNER JOIN eventos ON evento_funcionario.evento_id = eventos.id
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
    } catch (error) {
      console.error("Erro na consulta com snake_case:", error);
      
      // Se falhar, tentamos com camelCase (padrão usado sem underscored: true)
      try {
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
      } catch (innerError) {
        console.error("Erro na consulta com camelCase:", innerError);
        
        // Se ambas falharem, vamos usar uma consulta alternativa que verifica a estrutura da tabela
        let tableInfoQuery = "PRAGMA table_info(evento_funcionario);";
        let tableInfo;
        
        try {
          tableInfo = await sequelize.query(tableInfoQuery, { type: QueryTypes.SELECT });
          
          // Determinar os nomes das colunas
          const eventoColName = tableInfo.find(col => col.name.toLowerCase().includes('evento')) ? 
                               tableInfo.find(col => col.name.toLowerCase().includes('evento')).name : 'evento_id';
          
          const funcionarioColName = tableInfo.find(col => col.name.toLowerCase().includes('funcionario')) ? 
                                    tableInfo.find(col => col.name.toLowerCase().includes('funcionario')).name : 'funcionario_id';
          
          // Usar os nomes corretos das colunas
          let finalQuery = `
            SELECT DISTINCT funcionarios.id, funcionarios.nome, 
                   funcionarios.cargo, funcionarios.matricula,
                   funcionarios.carga_horaria,
                   eventos.nome AS evento_nome, eventos.data AS evento_data
            FROM funcionarios
            INNER JOIN evento_funcionario ON funcionarios.id = evento_funcionario.${funcionarioColName}
            INNER JOIN eventos ON evento_funcionario.${eventoColName} = eventos.id
            WHERE 1=1`;
          
          const replacements = {};
          
          if (eventoId) {
            finalQuery += ` AND eventos.id = :eventoId`;
            replacements.eventoId = eventoId;
          }
          
          finalQuery += " ORDER BY funcionarios.nome ASC";
          
          const funcionarios = await sequelize.query(finalQuery, { 
            replacements,
            type: QueryTypes.SELECT 
          });
          
          return funcionarios;
        } catch (finalError) {
          console.error("Erro ao determinar estrutura da tabela:", finalError);
          throw new Error("Não foi possível consultar os funcionários por evento");
        }
      }
    }
  }

  static async findResumoFuncionariosParticipacao() {
    try {
      // Tentamos primeiro com snake_case
      const query = `
        SELECT funcionarios.id, funcionarios.nome, funcionarios.cargo,
               COUNT(DISTINCT evento_funcionario.evento_id) AS total_eventos
        FROM funcionarios
        LEFT JOIN evento_funcionario ON funcionarios.id = evento_funcionario.funcionario_id
        GROUP BY funcionarios.id, funcionarios.nome, funcionarios.cargo
        ORDER BY total_eventos DESC, funcionarios.nome ASC`;
      
      const resumo = await sequelize.query(query, { type: QueryTypes.SELECT });
      return resumo;
    } catch (error) {
      console.error("Erro na consulta com snake_case:", error);
      
      // Se falhar, tentamos com camelCase
      try {
        const query = `
          SELECT funcionarios.id, funcionarios.nome, funcionarios.cargo,
                 COUNT(DISTINCT evento_funcionario.eventoId) AS total_eventos
          FROM funcionarios
          LEFT JOIN evento_funcionario ON funcionarios.id = evento_funcionario.funcionarioId
          GROUP BY funcionarios.id, funcionarios.nome, funcionarios.cargo
          ORDER BY total_eventos DESC, funcionarios.nome ASC`;
        
        const resumo = await sequelize.query(query, { type: QueryTypes.SELECT });
        return resumo;
      } catch (innerError) {
        console.error("Erro na consulta com camelCase:", innerError);
        
        // Se ambas falharem, retornamos um resultado vazio com mensagem
        return [{ mensagem: "Não foi possível obter o resumo de participação dos funcionários" }];
      }
    }
  }
}

export { FuncionarioService };