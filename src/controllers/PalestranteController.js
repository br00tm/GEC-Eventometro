import { PalestranteService } from "../services/PalestranteService.js";
//MATEUS DE ANGELI
class PalestranteController {

  static async findAll(req, res, next) {
    PalestranteService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }

  static async findPalestrantesPorEvento(req, res, next) {
    PalestranteService.findPalestrantesPorEvento(req)
      .then(palestrantes => res.json(palestrantes))
      .catch(next);
  }

  static async findResumoPalestrantesParticipacao(req, res, next) {
    PalestranteService.findResumoPalestrantesParticipacao()
      .then(resumo => res.json(resumo))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    PalestranteService.findByPk(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async create(req, res, next) {
    PalestranteService.create(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async update(req, res, next) {
    PalestranteService.update(req)
      .then(obj => res.json(obj))
      .catch(next);
  }

  static async delete(req, res, next) {
    PalestranteService.delete(req)
      .then(obj => res.json(obj))
      .catch(next);
  }
}

export { PalestranteController };