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

    // Regra de negócio: não podem existir dois local com o mesmo nome
    const objByNome = await Local.findAll({where : {nome: nome}});
    if (objByNome.length == 1){
      throw new Error ("Já existe um Local com este nome");
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
    var obj = await Local.findByPk(id);
    obj = await obj.destroy();
    return obj;
  }

}

export { LocalService };
