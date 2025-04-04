import { CertificadoService } from "../services/CertificadoService.js";

class CertificadoController {

  static async findAll(req, res, next) {
    CertificadoService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    CertificadoService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    CertificadoService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    CertificadoService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    CertificadoService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { CertificadoController };