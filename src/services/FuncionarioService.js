import { Funcionario } from "../models/Funcionario.js";
//MATEUS DE ANGELI
class FuncionarioService {
  
  static async findAll(req, res) {
    const objs = await Funcionario.findAll();
    return objs;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id);
    return obj;
  }

  static async create(req, res) {
    const { nome, cargo, matricula, carga_horaria } = req.body;

    // Coletar todos os erros
    let errors = [];

    // Validação: matrícula única
    const funcionarioExistente = await Funcionario.findOne({ where: { matricula: matricula } });
    if (funcionarioExistente) {
      errors.push("Já existe um funcionário cadastrado com esta matrícula");
    }
    
    // Validação: carga horária positiva
    if (carga_horaria < 0) {
      errors.push("A carga horária não pode ser negativa");
    }
    
    // Validação do nome
    if (!nome || nome.length < 2) {
      errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    // Validação do cargo
    if (!cargo || cargo.length < 2) {
      errors.push("Cargo não pode ser vazio");
    }
    
    // Se tiver erros, lança todos juntos
    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }

    const obj = await Funcionario.create({ nome, cargo, matricula, carga_horaria });
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, cargo, matricula, carga_horaria } = req.body;
    
    // Validação: funcionário existe?
    var obj = await Funcionario.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Funcionário não encontrado");
    }
    
    // Validação: matrícula única (exceto para o mesmo funcionário)
    if (matricula !== obj.matricula) {
      const funcionarioExistente = await Funcionario.findOne({ where: { matricula: matricula } });
      if (funcionarioExistente) {
        throw new Error("Já existe um funcionário cadastrado com esta matrícula");
      }
    }
    
    // Validação: carga horária positiva
    if (carga_horaria < 0) {
      throw new Error("A carga horária não pode ser negativa");
    }
    
    Object.assign(obj, { nome, cargo, matricula, carga_horaria });
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    const obj = await Funcionario.findByPk(id);
    if (!obj) {
      throw new Error("Funcionário não encontrado");
    }
    
    try {
      await obj.destroy();
      return obj;
    } catch (error) {
      throw new Error("Não foi possível remover este funcionário");
    }
  }
}

export { FuncionarioService };