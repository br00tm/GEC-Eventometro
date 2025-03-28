import { Model, DataTypes } from 'sequelize';

class Participante extends Model {
  static init(sequelize) {
    super.init({
      nome: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Nome do Participante deve ser preenchido!" },
          len: { args: [2, 50], msg: "Nome do Participante deve ter entre 2 e 50 letras!" }
        }
      },
      email: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Email do Participante deve ser preenchido!" },
          isEmail: { msg: "Email do Participante deve ser válido!" }
        }
      },
      telefone: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Telefone do Participante deve ser preenchido!" },
          is: { args: ["\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}"], msg: "Telefone deve seguir o padrão (99) 99999-9999!" }
        }
      },
      endereco: { 
        type: DataTypes.STRING, 
        validate: {
          notEmpty: { msg: "Endereço do Participante deve ser preenchido!" },
          len: { args: [5, 200], msg: "Endereço deve ter entre 5 e 200 caracteres!" }
        }
      }
    }, { sequelize, modelName: 'participante', tableName: 'participantes' })
  }

  static associate(models) {
    this.hasMany(models.Avaliacao, { foreignKey: 'participante_id', as: 'avaliacoes' });
    this.hasMany(models.Certificado, { foreignKey: 'participante_id', as: 'certificados' });
    this.hasMany(models.Presenca, { foreignKey: 'participante_id', as: 'presencas' });
  }
}

export { Participante };