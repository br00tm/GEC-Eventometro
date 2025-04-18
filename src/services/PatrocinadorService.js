import { Patrocinador } from "../models/Patrocinador.js";
//PEDRO BRITO
class PatrocinadorService {
  
  static async findAll(req, res) {
    const objs = await Patrocinador.findAll();
    return objs;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Patrocinador.findByPk(id);
    return obj;
  }

  static async create(req, res) {
    const { nome, empresa, cnpj, endereco } = req.body;
  
    let errors = [];
  
    const patrocinadorExistente = await Patrocinador.findOne({ where: { cnpj: cnpj } });
    if (patrocinadorExistente) {
      errors.push("Já existe um patrocinador cadastrado com este CNPJ");
    }
  
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(cnpj)) {
      errors.push("CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX");
    }
  
    if (!nome || nome.length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
  
    if (!empresa || empresa.trim() === "") {
      errors.push("Empresa não pode ser vazia");
    }
  
    if (!endereco || endereco.trim() === "") {
      errors.push("Endereço não pode ser vazio");
    }
  
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  
    const obj = await Patrocinador.create({ nome, empresa, cnpj, endereco });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, empresa, cnpj, endereco } = req.body;
    
    var obj = await Patrocinador.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Patrocinador não encontrado");
    }
    
    if (cnpj !== obj.cnpj) {
      const patrocinadorExistente = await Patrocinador.findOne({ where: { cnpj: cnpj } });
      if (patrocinadorExistente) {
        throw new Error("Já existe um patrocinador cadastrado com este CNPJ");
      }
    }
    
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
    if (!cnpjRegex.test(cnpj)) {
      throw new Error("CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX");
    }
    
    Object.assign(obj, { nome, empresa, cnpj, endereco });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Patrocinador.findByPk(id);
    if (!obj) {
      throw new Error("Patrocinador não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este patrocinador");
    }
  }
}

export { PatrocinadorService };