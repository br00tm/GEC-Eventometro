import { Model, DataTypes } from 'sequelize';

class Palestrante extends Model {
  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Palestrante deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Palestrante deve ter entre 2 e 50 letras!" }
        }
      },
      email: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Email do Palestrante deve ser preenchido!" },
          isEmail: { msg: "Email do Palestrante deve ser válido!" }
        }
      },
      especialidade: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Especialidade do Palestrante deve ser preenchida!" },
          len: { args: [2, 50], msg: "Especialidade deve ter entre 2 e 50 letras!" }
        }
      },
      nome_palestra: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome da Palestra deve ser preenchido!" },
          len: { args: [2, 100], msg: "Nome da Palestra deve ter entre 2 e 100 letras!" }
        }
      }
    }, { sequelize, modelName: 'palestrante', tableName: 'palestrantes' })
  }

  static associate(models) {

  }
}

export { Palestrante };
