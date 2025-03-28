import { Model, DataTypes } from 'sequelize';

class Funcionario extends Model {
  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Funcionário deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Funcionário deve ter entre 2 e 50 letras!" }
        }
      },
      cargo: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Cargo do Funcionário deve ser preenchido!" },
          len: { args: [2, 50], msg: "Cargo deve ter entre 2 e 50 letras!" }
        }
      },
      matricula: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Matrícula do Funcionário deve ser preenchida!" },
          len: { args: [5, 20], msg: "Matrícula deve ter entre 5 e 20 caracteres!" }
        }
      },
      carga_horaria: { 
        type: DataTypes.DOUBLE, 
        validate: {
          notEmpty: { msg: "Carga horária do Funcionário deve ser preenchida!" },
          min: { args: [0], msg: "Carga horária não pode ser negativa!" }
        }
      }
    }, { sequelize, modelName: 'funcionario', tableName: 'funcionarios' })
  }

  static associate(models) {
    this.belongsToMany(models.Evento, { through: 'evento_funcionario', as: 'eventos' });
  }
}

export { Funcionario };