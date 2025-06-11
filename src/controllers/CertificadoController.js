import { CertificadoService } from "../services/CertificadoService.js";
//PEDRO BRITO
class CertificadoController {

  static async findAll(req, res, next) {
    CertificadoService.findAll()
      .then(objs => res.json(objs))
      .catch(next);
  }
  
  static async findCertificadosComFiltro(req, res, next) {
    CertificadoService.findCertificadosComFiltro(req)
      .then(certificados => res.json(certificados))
      .catch(next);
  }

  // Método para resumo de certificados por evento
  static async findResumoCertificadosPorEvento(req, res, next) {
    CertificadoService.findResumoCertificadosPorEvento()
      .then(resumo => res.json(resumo))
      .catch(next);
  }

  static async findByPk(req, res, next) {
    try {
      // Busca o certificado
      const obj = await CertificadoService.findByPk(req);
      // Se já tiver um arquivo gerado, transforma o caminho relativo em URL completa
      if (obj?.arquivo_path) {
        const fullUrl = `${req.protocol}://${req.get('host')}${obj.arquivo_path}`;
        obj.arquivo_path = fullUrl;
      }
      res.json(obj);
    } catch (error) {
      next(error);
    }
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
  
  // Método para gerar o certificado a partir do ID
  static async gerarCertificado(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID do certificado não informado" });
      }

      // Busca o certificado e relacionamentos
      const certificado = await CertificadoService.findByPk(req);
      if (!certificado) {
        return res.status(404).json({ message: "Certificado não encontrado" });
      }

      // Gera o HTML do certificado dinamicamente
      const html = CertificadoService.gerarHTMLCertificado(certificado);
      // Retorna o HTML com o content-type correto
      res.set('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (error) {
      next(error);
    }
  }
}

export { CertificadoController };