import { Model, DataTypes } from 'sequelize';

class Local extends Model {

    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do Local deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Local deve ter entre 2 e 50 letras!" }
                }
            },
            uf: {
                type: DataTypes.CHAR,
                validate: {
                    notEmpty: { msg: "A UF deve ser preenchida!" },
                    len: { args: [2, 2], msg: "UF deve ter exatamente 2 letras!" }
                }
            },
            cidade: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome da Cidade deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome da Cidade deve ter entre 2 e 50 letras!" }
                }
            },
            bairro: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do Bairro deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Bairro deve ter entre 2 e 50 letras!" }
                }
            },
            lotacao: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: { msg: "Lotação deve ser preenchida!" },
                    min: { args: [500], msg: "Lotação deve ser no mínimo 500!" }
                }
            }
        }, { sequelize, modelName: 'local', tableName: 'locais' })
    }

    static associate(models) {
        this.hasMany(models.Evento, { foreignKey: 'local_id', as: 'eventos' });
    }
}

export { Local };