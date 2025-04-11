import { Participante } from "../models/Participante.js";
//PEDRO BRITO
class ParticipanteService {
  
  static async findAll(req, res) {
    const objs = await Participante.findAll();
    return objs;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Participante.findByPk(id);
    return obj;
  }

  static async create(req, res) {
    const { nome, email, telefone, endereco } = req.body;
  
    let errors = [];
  
    const participanteExistente = await Participante.findOne({ where: { email: email } });
    if (participanteExistente) {
      errors.push("Já existe um participante cadastrado com este email");
    }
    
    const telefoneRegex = /^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/;
    if (!telefoneRegex.test(telefone)) {
      errors.push("Telefone deve estar no formato (99) 99999-9999");
    }
  
    if (!nome || nome.length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
  
    if (!endereco || endereco.trim() === "") {
      errors.push("Endereço não pode ser vazio");
    }
  
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  
    const obj = await Participante.create({ nome, email, telefone, endereco });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, email, telefone, endereco } = req.body;
    
    var obj = await Participante.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Participante não encontrado");
    }
    
    if (email !== obj.email) {
      const participanteExistente = await Participante.findOne({ where: { email: email } });
      if (participanteExistente) {
        throw new Error("Já existe um participante cadastrado com este email");
      }
    }
    
    const telefoneRegex = /^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/;
    if (!telefoneRegex.test(telefone)) {
      throw new Error("Telefone deve estar no formato (99) 99999-9999");
    }
    
    Object.assign(obj, { nome, email, telefone, endereco });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Participante.findByPk(id);
    if (!obj) {
      throw new Error("Participante não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este participante");
    }
  }
}

export { ParticipanteService };