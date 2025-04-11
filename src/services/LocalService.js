import { Local } from "../models/Local.js";
//PEDRO GOMES
class LocalService {
  
  static async findAll(req, res) {
    const objs = await Local.findAll();
    return objs;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Local.findByPk(id);
    return obj;
  }

  static async create(req, res) {
    const { nome, uf, cidade, bairro, lotacao } = req.body;
  
    // Coletar todos os erros
    let errors = [];
  
    // Regra de negócio: não podem existir dois local com o mesmo nome
    const objByNome = await Local.findAll({where : {nome: nome}});
    if (objByNome.length == 1) {
      errors.push("Já existe um Local com este nome");
    }
    
    // Validação de UF
    const ufRegex = /^[A-Z]{2}$/;
    if (!ufRegex.test(uf)) {
      errors.push("UF deve ser válida (2 letras)");
    }
    
    // Validação da cidade
    if (!cidade || cidade.length < 2) {
      errors.push("Nome da cidade deve ter pelo menos 2 caracteres");
    }
    
    // Validação do bairro
    if (!bairro || bairro.length < 2) {
      errors.push("Nome do bairro deve ter pelo menos 2 caracteres");
    }
    
    // Validação da lotação
    if (lotacao < 500) {
      errors.push("Lotação deve ser no mínimo 500");
    }
    
    // Se tiver erros, lança todos juntos
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }
  
    const obj = await Local.create({ nome, uf, cidade, bairro, lotacao });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, uf, cidade, bairro, lotacao } = req.body;
    var obj = await Local.findOne({ where: { id: id } });
    Object.assign(obj, { nome, uf, cidade, bairro, lotacao });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Local.findByPk(id);
    if (!obj) {
      throw new Error("Local não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este local");
    }
  }
}

export { LocalService };
