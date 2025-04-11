import { Certificado } from "../models/Certificado.js";
import { Participante } from "../models/Participante.js";
import { Evento } from "../models/Evento.js";
//PEDRO BRITO
class CertificadoService {
  
  static async findAll(req, res) {
    const objs = await Certificado.findAll({
      include: [
        { model: Participante, as: 'participante' },
        { model: Evento, as: 'evento' }
      ]
    });
    return objs;
  }

  static async findByPk(req, res) {
    const { id } = req.params;
    const obj = await Certificado.findByPk(id, {
      include: [
        { model: Participante, as: 'participante' },
        { model: Evento, as: 'evento' }
      ]
    });
    return obj;
  }

  static async create(req, res) {
    const { nome, data_emissao, cod_validacao, tipo_certificado, participante_id, evento_id } = req.body;

    // Validação: código de validação único
    const certificadoExistente = await Certificado.findOne({ 
      where: { cod_validacao: cod_validacao } 
    });
    
    if (certificadoExistente) {
      throw new Error("Já existe um certificado com este código de validação");
    }

    const obj = await Certificado.create({ 
      nome, 
      data_emissao, 
      cod_validacao, 
      tipo_certificado,
      participante_id,
      evento_id
    });
    
    return obj;
  }

  static async update(req, res) {
    const { id } = req.params;
    const { nome, data_emissao, cod_validacao, tipo_certificado, participante_id, evento_id } = req.body;
    
    // Validação: certificado existe?
    var obj = await Certificado.findOne({ where: { id: id } });
    if (!obj) {
      throw new Error("Certificado não encontrado");
    }
    
    // Validação: código de validação único (exceto para o mesmo certificado)
    if (cod_validacao !== obj.cod_validacao) {
      const certificadoExistente = await Certificado.findOne({ 
        where: { cod_validacao: cod_validacao } 
      });
      
      if (certificadoExistente) {
        throw new Error("Já existe um certificado com este código de validação");
      }
    }
    
    Object.assign(obj, { 
      nome, 
      data_emissao, 
      cod_validacao, 
      tipo_certificado,
      participante_id,
      evento_id
    });
    
    obj = await obj.save();
    return obj;
  }

  static async delete(req, res) {
    const { id } = req.params;
    var obj = await Certificado.findByPk(id);
    if (!obj) {
      throw new Error("Certificado não encontrado");
    }
    
    obj = await obj.destroy();
    return obj;
  }
}

export { CertificadoService };