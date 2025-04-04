import { Evento } from "../models/Evento.js";
import { Local } from "../models/Local.js";

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

    // Regra de negócio: não podem existir dois eventos com o mesmo nome na mesma data
    const objDuplicado = await Evento.findAll({
      where: {
        nome: nome,
        data: data
      }
    });
    
    if (objDuplicado.length > 0) {
      throw new Error("Já existe um Evento com este nome nesta data");
    }

    const obj = await Evento.create({ nome, data, local_id });
    return obj;
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
    var obj = await Evento.findByPk(id);
    if (!obj) {
      throw new Error("Evento não encontrado");
    }
    
    obj = await obj.destroy();
    return obj;
  }
}

export { EventoService };