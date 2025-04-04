import { Presenca } from "../models/Presenca.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";

class PresencaService {
  
  static async findAll(req, res) {
    const objs = await Presenca.findAll({
      include: [
        { model: Participante, as: 'participante' },
        { model: Evento, as: 'evento' }
      ]
    });
    return objs;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Presenca.findByPk(id, {
      include: [
        { model: Participante, as: 'participante' },
        { model: Evento, as: 'evento' }
      ]
    });
    return obj;
  }

  static async create(req, res) {
    const { data, horario, tipo_presenca, modo_registro, participante_id, evento_id } = req.body;

    // Validação: formato do horário (HH:MM)
    const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horarioRegex.test(horario)) {
      throw new Error("Horário deve estar no formato HH:MM");
    }

    const obj = await Presenca.create({ 
      data, 
      horario, 
      tipo_presenca, 
      modo_registro,
      participante_id,
      evento_id
    });
    
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { data, horario, tipo_presenca, modo_registro, participante_id, evento_id } = req.body;
    
    // Validação: presença existe?
    var obj = await Presenca.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Presença não encontrada");
    }
    
    // Validação: formato do horário (HH:MM)
    const horarioRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horarioRegex.test(horario)) {
      throw new Error("Horário deve estar no formato HH:MM");
    }
    
    Object.assign(obj, { 
      data, 
      horario, 
      tipo_presenca, 
      modo_registro,
      participante_id,
      evento_id
    });
    
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    var obj = await Presenca.findByPk(id);
    if (!obj) {
      throw new Error("Presença não encontrada");
    }
    
    obj = await obj.destroy();
    return obj;
  }
}

export { PresencaService };