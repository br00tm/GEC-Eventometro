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
    }, { 
      sequelize, 
      modelName: 'evento', 
      tableName: 'eventos',
      underscored: true // Garante snake_case para nomes de colunas
    })
  }

  static associate(models) {
    this.belongsTo(models.Local, { foreignKey: 'local_id', as: 'local' });
    
    // Definindo explicitamente nomes de colunas para tabelas de junção
    this.belongsToMany(models.Palestrante, { 
      through: 'evento_palestrante',
      foreignKey: 'evento_id',
      otherKey: 'palestrante_id',
      as: 'palestrantes' 
    });
    
    this.belongsToMany(models.Patrocinador, { 
      through: 'evento_patrocinador',
      foreignKey: 'evento_id',
      otherKey: 'patrocinador_id',
      as: 'patrocinadores' 
    });
    
    this.belongsToMany(models.Funcionario, { 
      through: 'evento_funcionario',
      foreignKey: 'evento_id',
      otherKey: 'funcionario_id',
      as: 'funcionarios' 
    });
    
    // Adicionar outras associações
    this.hasMany(models.Avaliacao, { foreignKey: 'evento_id', as: 'avaliacoes' });
    this.hasMany(models.Certificado, { foreignKey: 'evento_id', as: 'certificados' });
    this.hasMany(models.Presenca, { foreignKey: 'evento_id', as: 'presencas' });
  }
}

export { Evento };