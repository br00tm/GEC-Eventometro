import { FuncionarioService } from "../services/FuncionarioService.js";
//MATEUS DE ANGELI
class FuncionarioController {

  static async findAll(req, res, next) {
    FuncionarioService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findFuncionariosPorEvento(req, res, next) {
    FuncionarioService.findFuncionariosPorEvento(req)
      .then(funcionarios => res.json(funcionarios))
      .catch(next);
  }


  static async findResumoFuncionariosParticipacao(req, res, next) {
    FuncionarioService.findResumoFuncionariosParticipacao()
      .then(resumo => res.json(resumo))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    FuncionarioService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    FuncionarioService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    FuncionarioService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    FuncionarioService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { FuncionarioController };