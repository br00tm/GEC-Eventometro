import { Avaliacao } from "../models/Avaliacao.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
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

    // Validação adicional: nota entre 0 e 5
    if (nota < 0 || nota > 5) {
      throw new Error("A nota deve estar entre 0 e 5");
    }

    const obj = await Avaliacao.create({ 
      nota, 
      comentarios, 
      data_avaliacao, 
      participante,
      participante_id,
      evento_id
    });
    
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nota, comentarios, data_avaliacao, participante, participante_id, evento_id } = req.body;
    
    // Validação adicional: nota entre 0 e 10
    if (nota < 0 || nota > 10) {
      throw new Error("A nota deve estar entre 0 e 5");
    }
    
    var obj = await Avaliacao.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Avaliação não encontrada");
    }
    
    Object.assign(obj, { 
      nota, 
      comentarios, 
      data_avaliacao, 
      participante,
      participante_id,
      evento_id
    });
    
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    var obj = await Avaliacao.findByPk(id);
    if (!obj) {
      throw new Error("Avaliação não encontrada");
    }
    
    obj = await obj.destroy();
    return obj;
  }
}

export { AvaliacaoService };