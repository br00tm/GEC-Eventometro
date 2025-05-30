import { PresencaService } from "../services/PresencaService.js";
//MATEUS DE ANGELI
class PresencaController {

  static async findAll(req, res, next) {
    PresencaService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findPresencasComFiltro(req, res, next) {
    PresencaService.findPresencasComFiltro(req)
      .then(presencas => res.json(presencas))
      .catch(next);
  }

  static async findResumoPresencasPorEvento(req, res, next) {
    PresencaService.findResumoPresencasPorEvento()
      .then(resumo => res.json(resumo))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    PresencaService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    PresencaService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    PresencaService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    PresencaService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { PresencaController };