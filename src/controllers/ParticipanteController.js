import { ParticipanteService } from "../services/ParticipanteService.js";

class ParticipanteController {

  static async findAll(req, res, next) {
    ParticipanteService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    ParticipanteService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    ParticipanteService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    ParticipanteService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    ParticipanteService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { ParticipanteController };