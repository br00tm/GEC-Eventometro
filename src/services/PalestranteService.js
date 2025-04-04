import { Palestrante } from "../models/Palestrante.js";

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

    // Validação: email único
    const palestranteExistente = await Palestrante.findOne({ where: { email: email } });
    if (palestranteExistente) {
      throw new Error("Já existe um palestrante cadastrado com este email");
    }

    const obj = await Palestrante.create({ nome, email, especialidade, nome_palestra });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, email, especialidade, nome_palestra } = req.body;
    
    // Validação: palestrante existe?
    var obj = await Palestrante.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Palestrante não encontrado");
    }
    
    // Validação: email único (exceto para o mesmo palestrante)
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
    var obj = await Palestrante.findByPk(id);
    if (!obj) {
      throw new Error("Palestrante não encontrado");
    }
    
    obj = await obj.destroy();
    return obj;
  }
}

export { PalestranteService };