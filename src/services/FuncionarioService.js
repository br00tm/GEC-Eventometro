import { Funcionario } from "../models/Funcionario.js";

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

    // Validação: matrícula única
    const funcionarioExistente = await Funcionario.findOne({ where: { matricula: matricula } });
    if (funcionarioExistente) {
      throw new Error("Já existe um funcionário cadastrado com esta matrícula");
    }
    
    // Validação: carga horária positiva
    if (carga_horaria < 0) {
      throw new Error("A carga horária não pode ser negativa");
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
    var obj = await Funcionario.findByPk(id);
    if (!obj) {
      throw new Error("Funcionário não encontrado");
    }
    
    obj = await obj.destroy();
    return obj;
  }
}

export { FuncionarioService };