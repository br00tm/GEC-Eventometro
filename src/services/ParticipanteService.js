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
  
    // Coletar todos os erros
    let errors = [];
  
    // Validação: email único
    const participanteExistente = await Participante.findOne({ where: { email: email } });
    if (participanteExistente) {
      errors.push("Já existe um participante cadastrado com este email");
    }
    
    // Validação: formato do telefone
    const telefoneRegex = /^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/;
    if (!telefoneRegex.test(telefone)) {
      errors.push("Telefone deve estar no formato (99) 99999-9999");
    }
  
    // Validação do nome
    if (!nome || nome.length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
  
    // Validação do endereço
    if (!endereco || endereco.trim() === "") {
      errors.push("Endereço não pode ser vazio");
    }
  
    // Se tiver erros, lança todos juntos
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  
    const obj = await Participante.create({ nome, email, telefone, endereco });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, email, telefone, endereco } = req.body;
    
    // Validação: participante existe?
    var obj = await Participante.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Participante não encontrado");
    }
    
    // Validação: email único (exceto para o mesmo participante)
    if (email !== obj.email) {
      const participanteExistente = await Participante.findOne({ where: { email: email } });
      if (participanteExistente) {
        throw new Error("Já existe um participante cadastrado com este email");
      }
    }
    
    // Validação: formato do telefone
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