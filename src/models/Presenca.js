import { Model, DataTypes } from 'sequelize';

class Presenca extends Model {
  static init(sequelize) {
    super.init({
      data: { 
        type: DataTypes.DATEONLY, 
        validate: {
          isDate: { msg: "Data da Presença deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Presença deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      horario: { 
        type: DataTypes.CHAR, 
        validate: {
          notEmpty: { msg: "Horário da Presença deve ser preenchido!" },
          is: {args: ["[0-9]{2}:[0-9]{2}"], msg: "Horário deve seguir o padrão HH:MM!" }
        }
      },
      tipo_presenca: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Tipo de Presença deve ser preenchido!" },
          len: { args: [2, 50], msg: "Tipo de Presença deve ter entre 2 e 50 letras!" }
        }
      },
      modo_registro: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Modo de Registro deve ser preenchido!" },
          len: { args: [2, 50], msg: "Modo de Registro deve ter entre 2 e 50 letras!" }
        }
      }
    }, { sequelize, modelName: 'presenca', tableName: 'presencas' })
  }

  static associate(models) {
    this.belongsTo(models.Participante, { foreignKey: 'participante_id', as: 'participante' });
  }
}

export { Presenca };