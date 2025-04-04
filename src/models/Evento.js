import { Model, DataTypes } from 'sequelize';

class Evento extends Model {
  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Evento deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Evento deve ter entre 2 e 50 letras!" }
        }
      },
      data: { 
        type: DataTypes.DATEONLY, 
        validate: {
          isDate: { msg: "Data do Evento deve ser preenchida!" },
          is: {args: ["[0-9]{4}\-[0-9]{2}\-[0-9]{2}"], msg: "Data do Evento deve seguir o padrão yyyy-MM-dd!" }
        }
      }
    }, { sequelize, modelName: 'evento', tableName: 'eventos' })
  }

  static associate(models) {
    this.belongsTo(models.Local, { foreignKey: 'local_id', as: 'local' });
    this.belongsToMany(models.Palestrante, { through: 'evento_palestrante', as: 'palestrantes' });
    this.belongsToMany(models.Patrocinador, { through: 'evento_patrocinador', as: 'patrocinadores' });
    this.belongsToMany(models.Funcionario, { through: 'evento_funcionario', as: 'funcionarios' });
  }
}

export { Evento };