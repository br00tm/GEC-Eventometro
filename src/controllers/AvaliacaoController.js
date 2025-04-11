import { AvaliacaoService } from "../services/AvaliacaoService.js";
//PEDRO GOMES
class AvaliacaoController {

  static async findAll(req, res, next) {
    AvaliacaoService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    AvaliacaoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    AvaliacaoService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    AvaliacaoService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    AvaliacaoService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { AvaliacaoController };