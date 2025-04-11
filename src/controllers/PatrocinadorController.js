import { PatrocinadorService } from "../services/PatrocinadorService.js";
//PEDRO BRITO
class PatrocinadorController {

  static async findAll(req, res, next) {
    PatrocinadorService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    PatrocinadorService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    PatrocinadorService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    PatrocinadorService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    PatrocinadorService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { PatrocinadorController };