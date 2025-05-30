import { Palestrante } from "../models/Palestrante.js";
import sequelize from "../config/database-connection.js";
import { QueryTypes } from "sequelize";

class PalestranteService {
  
  static async findAll(req, res) {
    const objs = await Palestrante.findAll();
    return objs;
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

  // Relatórios
  
  static async findPalestrantesPorEvento(req) {
    const { eventoId } = req.query;
    
    // Tentamos primeiro com snake_case (padrão usado com underscored: true)
    try {
      let query = `
        SELECT DISTINCT palestrantes.id, palestrantes.nome, 
               palestrantes.email, palestrantes.especialidade,
               palestrantes.nome_palestra,
               eventos.nome AS evento_nome, eventos.data AS evento_data
        FROM palestrantes
        INNER JOIN evento_palestrante ON palestrantes.id = evento_palestrante.palestrante_id
        INNER JOIN eventos ON evento_palestrante.evento_id = eventos.id
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
    } catch (error) {
      console.error("Erro na consulta com snake_case:", error);
      
      // Se falhar, tentamos com camelCase (padrão usado sem underscored: true)
      try {
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
      } catch (innerError) {
        console.error("Erro na consulta com camelCase:", innerError);
        
        // Se ambas falharem, vamos usar uma consulta alternativa que verifica a estrutura da tabela
        let tableInfoQuery = "PRAGMA table_info(evento_palestrante);";
        let tableInfo;
        
        try {
          tableInfo = await sequelize.query(tableInfoQuery, { type: QueryTypes.SELECT });
          
          // Determinar os nomes das colunas
          const eventoColName = tableInfo.find(col => col.name.toLowerCase().includes('evento')) ? 
                               tableInfo.find(col => col.name.toLowerCase().includes('evento')).name : 'evento_id';
          
          const palestranteColName = tableInfo.find(col => col.name.toLowerCase().includes('palestrante')) ? 
                                    tableInfo.find(col => col.name.toLowerCase().includes('palestrante')).name : 'palestrante_id';
          
          // Usar os nomes corretos das colunas
          let finalQuery = `
            SELECT DISTINCT palestrantes.id, palestrantes.nome, 
                   palestrantes.email, palestrantes.especialidade,
                   palestrantes.nome_palestra,
                   eventos.nome AS evento_nome, eventos.data AS evento_data
            FROM palestrantes
            INNER JOIN evento_palestrante ON palestrantes.id = evento_palestrante.${palestranteColName}
            INNER JOIN eventos ON evento_palestrante.${eventoColName} = eventos.id
            WHERE 1=1`;
          
          const replacements = {};
          
          if (eventoId) {
            finalQuery += ` AND eventos.id = :eventoId`;
            replacements.eventoId = eventoId;
          }
          
          finalQuery += " ORDER BY palestrantes.nome ASC";
          
          const palestrantes = await sequelize.query(finalQuery, { 
            replacements,
            type: QueryTypes.SELECT 
          });
          
          return palestrantes;
        } catch (finalError) {
          console.error("Erro ao determinar estrutura da tabela:", finalError);
          throw new Error("Não foi possível consultar os palestrantes por evento");
        }
      }
    }
  }

  static async findResumoPalestrantesParticipacao() {
    try {
      // Tentamos primeiro com snake_case
      const query = `
        SELECT palestrantes.id, palestrantes.nome, palestrantes.especialidade,
               COUNT(DISTINCT evento_palestrante.evento_id) AS total_eventos
        FROM palestrantes
        LEFT JOIN evento_palestrante ON palestrantes.id = evento_palestrante.palestrante_id
        GROUP BY palestrantes.id, palestrantes.nome, palestrantes.especialidade
        ORDER BY total_eventos DESC, palestrantes.nome ASC`;
      
      const resumo = await sequelize.query(query, { type: QueryTypes.SELECT });
      return resumo;
    } catch (error) {
      console.error("Erro na consulta com snake_case:", error);
      
      // Se falhar, tentamos com camelCase
      try {
        const query = `
          SELECT palestrantes.id, palestrantes.nome, palestrantes.especialidade,
                 COUNT(DISTINCT evento_palestrante.eventoId) AS total_eventos
          FROM palestrantes
          LEFT JOIN evento_palestrante ON palestrantes.id = evento_palestrante.palestranteId
          GROUP BY palestrantes.id, palestrantes.nome, palestrantes.especialidade
          ORDER BY total_eventos DESC, palestrantes.nome ASC`;
        
        const resumo = await sequelize.query(query, { type: QueryTypes.SELECT });
        return resumo;
      } catch (innerError) {
        console.error("Erro na consulta com camelCase:", innerError);
        
        // Se ambas falharem, retornamos um resultado vazio com mensagem
        return [{ mensagem: "Não foi possível obter o resumo de participação dos palestrantes" }];
      }
    }
  }
}

export { PalestranteService };