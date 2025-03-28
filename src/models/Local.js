import { Model, DataTypes } from 'sequelize';

class Local extends Model {

    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome do Local deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Cliente deve ter entre 2 e 50 letras!" }
                }
            },
            uf: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "A UF deve ser preenchido!" },
                    len: { args: [2], msg: "Só pode ter duas letras!" }
                }
            },
            cidade : {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome Cidade deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome da Cidade deve ter entre 2 e 50 letras!" }
                }
            },
            bairro : {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Nome Bairro deve ser preenchido!" },
                    len: { args: [2, 50], msg: "Nome do Bairro deve ter entre 2 e 50 letras!" }
                }
            },
            lotacao : {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: { msg: "Quantidade Bairro deve ser preenchido!" },
                    min: { args: [500], msg: "Lotação deve ser no mínimo 500!" }
                }
            }
        }, { sequelize, modelName: 'local', tableName: 'locais' })
    }
}

export { Local };