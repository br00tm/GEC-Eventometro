import { LocalService } from "../services/LocalService.js";
//PEDRO GOMES
class LocalController {

  static async findAll(req, res, next) {
    LocalService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    LocalService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    LocalService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    LocalService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    LocalService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

}

export { LocalController };