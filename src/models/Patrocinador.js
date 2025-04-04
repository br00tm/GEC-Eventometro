import { Model, DataTypes } from 'sequelize';

class Patrocinador extends Model {
  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Patrocinador deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Patrocinador deve ter entre 2 e 50 letras!" }
        }
      },
      empresa: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Empresa do Patrocinador deve ser preenchida!" },
          len: { args: [2, 100], msg: "Nome da Empresa deve ter entre 2 e 100 letras!" }
        }
      },
      cnpj: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "CNPJ do Patrocinador deve ser preenchido!" },
          is: {args: ["[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}"], msg: "CNPJ deve seguir o padrão XX.XXX.XXX/XXXX-XX!" }
        }
      },
      endereco: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Endereço do Patrocinador deve ser preenchido!" },
          len: { args: [5, 200], msg: "Endereço deve ter entre 5 e 200 caracteres!" }
        }
      }
    }, { sequelize, modelName: 'patrocinador', tableName: 'patrocinadores' })
  }

  static associate(models) {
  }
}

export { Patrocinador };