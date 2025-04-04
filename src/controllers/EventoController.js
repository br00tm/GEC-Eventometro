import { EventoService } from "../services/EventoService.js";

class EventoController {

  static async findAll(req, res, next) {
    EventoService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    EventoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    EventoService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    EventoService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    EventoService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { EventoController };