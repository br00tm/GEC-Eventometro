import { Model, DataTypes } from 'sequelize';

class Certificado extends Model {
  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Certificado deve ser preenchido!" },
          len: { args: [2, 100], msg: "Nome do Certificado deve ter entre 2 e 100 letras!" }
        }
      },
      data_emissao: { 
        type: DataTypes.DATEONLY, 
        validate: {
          isDate: { msg: "Data de Emissão deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data de Emissão deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      cod_validacao: { 
        type: DataTypes.INTEGER, 
        validate: {
          notEmpty: { msg: "Código de Validação deve ser preenchido!" }
        }
      },
      tipo_certificado: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Tipo de Certificado deve ser preenchido!" },
          len: { args: [2, 50], msg: "Tipo de Certificado deve ter entre 2 e 50 letras!" }
        }
      },
      descricao: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: { msg: "A descrição deve ser preenchida!" },
          len: { args: [3, 100], msg: "A descrição deve ter entre 3 e 100 caracteres!" }
        }
      }
    }, { sequelize, modelName: 'certificado', tableName: 'certificados' })
  }

  static associate(models) {
    this.belongsTo(models.Participante, { foreignKey: 'participante_id', as: 'participante' });
    this.belongsTo(models.Evento, { foreignKey: 'evento_id', as: 'evento' });
  }
}

export { Certificado };