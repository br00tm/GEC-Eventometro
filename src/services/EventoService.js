import { Evento } from "../models/Evento.js";
import { Local } from "../models/Local.js";
import sequelize from "../config/database-connection.js";
import { QueryTypes } from "sequelize";

class EventoService {
  
  static async findAll(req, res) {
    const objs = await Evento.findAll({
      include: [
        { model: Local, as: 'local' }
      ]
    });
    return objs;
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

  // Relatórios

  static async findEventosPorPeriodo(req) {
    const { inicio, termino } = req.query;
    
    let query = `
      SELECT eventos.id, eventos.nome, eventos.data, 
             locais.nome AS local_nome, locais.cidade, locais.lotacao
      FROM eventos
      LEFT JOIN locais ON eventos.local_id = locais.id
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
    
    query += " ORDER BY eventos.data DESC";
    
    const eventos = await sequelize.query(query, { 
      replacements,
      type: QueryTypes.SELECT 
    });
    
    return eventos;
  }

  static async findEventosComEstatisticas() {
    // Primeiro, verificamos a estrutura da tabela para usar os nomes corretos das colunas
    try {
      const query = `
        SELECT eventos.id, eventos.nome, eventos.data, 
               locais.nome AS local_nome, locais.cidade, locais.lotacao,
               COUNT(DISTINCT certificados.id) AS num_certificados,
               COUNT(DISTINCT presencas.id) AS num_presencas
        FROM eventos
        LEFT JOIN locais ON eventos.local_id = locais.id
        LEFT JOIN certificados ON eventos.id = certificados.evento_id
        LEFT JOIN presencas ON eventos.id = presencas.evento_id
        GROUP BY eventos.id, eventos.nome, eventos.data, locais.nome, locais.cidade, locais.lotacao
        ORDER BY eventos.data DESC`;
      
      const eventos = await sequelize.query(query, { type: QueryTypes.SELECT });
      
      // Agora obtemos as contagens de palestrantes e patrocinadores separadamente
      // pois podem usar nomes de colunas diferentes na tabela de junção
      for (const evento of eventos) {
        // Contagem de palestrantes
        try {
          const palestrantesQuery = `
            SELECT COUNT(DISTINCT palestrante_id) as count
            FROM evento_palestrante
            WHERE evento_id = :eventoId`;
          
          const palestrantesResult = await sequelize.query(palestrantesQuery, { 
            replacements: { eventoId: evento.id },
            type: QueryTypes.SELECT 
          });
          
          evento.num_palestrantes = palestrantesResult[0]?.count || 0;
        } catch (error) {
          // Se falhar, tente com nomes de colunas em camelCase
          try {
            const palestrantesQuery = `
              SELECT COUNT(DISTINCT palestranteId) as count
              FROM evento_palestrante
              WHERE eventoId = :eventoId`;
            
            const palestrantesResult = await sequelize.query(palestrantesQuery, { 
              replacements: { eventoId: evento.id },
              type: QueryTypes.SELECT 
            });
            
            evento.num_palestrantes = palestrantesResult[0]?.count || 0;
          } catch (innerError) {
            console.error("Erro ao contar palestrantes:", innerError);
            evento.num_palestrantes = 0;
          }
        }
        
        // Contagem de patrocinadores
        try {
          const patrocinadoresQuery = `
            SELECT COUNT(DISTINCT patrocinador_id) as count
            FROM evento_patrocinador
            WHERE evento_id = :eventoId`;
          
          const patrocinadoresResult = await sequelize.query(patrocinadoresQuery, { 
            replacements: { eventoId: evento.id },
            type: QueryTypes.SELECT 
          });
          
          evento.num_patrocinadores = patrocinadoresResult[0]?.count || 0;
        } catch (error) {
          // Se falhar, tente com nomes de colunas em camelCase
          try {
            const patrocinadoresQuery = `
              SELECT COUNT(DISTINCT patrocinadorId) as count
              FROM evento_patrocinador
              WHERE eventoId = :eventoId`;
            
            const patrocinadoresResult = await sequelize.query(patrocinadoresQuery, { 
              replacements: { eventoId: evento.id },
              type: QueryTypes.SELECT 
            });
            
            evento.num_patrocinadores = patrocinadoresResult[0]?.count || 0;
          } catch (innerError) {
            console.error("Erro ao contar patrocinadores:", innerError);
            evento.num_patrocinadores = 0;
          }
        }
      }
      
      return eventos;
    } catch (error) {
      console.error("Erro ao obter estatísticas de eventos:", error);
      throw error;
    }
  }
}

export { EventoService };