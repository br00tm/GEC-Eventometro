import { Model, DataTypes } from 'sequelize';

class Avaliacao extends Model {
  static init(sequelize) {
    super.init({
      nota: { 
        type: DataTypes.INTEGER, 
        validate: {
          notEmpty: { msg: "Nota da Avaliação deve ser preenchida!" },
          min: { args: [1], msg: "Nota mínima é 1!" },
          max: { args: [5], msg: "Nota máxima é 5!" }
        }
      },
      comentarios: { 
        type: DataTypes.STRING, 
        validate: {
          len: { args: [0, 500], msg: "Comentários devem ter no máximo 500 caracteres!" },
          obrigatorioSeNotaExtrema(value) {
            if ((this.nota === 1 || this.nota === 5) && (!value || value.trim() === "")) {
              throw new Error("Comentários são obrigatórios quando a nota é 1 ou 5!");
            }
          }
        }
      },
      
      data_avaliacao: { 
        type: DataTypes.DATEONLY, 
        validate: {
          isDate: { msg: "Data da Avaliação deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data da Avaliação deve seguir o padrão yyyy-MM-dd!" }
        }
      },
      participante: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Participante da Avaliação deve ser preenchido!" }
        }
      }
    }, { sequelize, modelName: 'avaliacao', tableName: 'avaliacoes' })
  }

  static associate(models) {
    this.belongsTo(models.Participante, { foreignKey: 'participante_id', as: 'participante_obj' });
    this.hasMany(models.Evento, { foreignKey: 'avaliacao_id', as: 'eventos' });
  }
}

export { Avaliacao };