import Sequelize from 'sequelize';
import {Cliente} from '../models/Cliente.js';
import { Local } from '../models/Local.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

Cliente.init(sequelize);
Local.init(sequelize);


(async () => {
    await sequelize.sync({ force: true });
    await Cliente.create({nome: "Alberto", cpf: "111.111.111-11", nascimento: "2001-01-01"});
    await Cliente.create({nome: "Bernardo", cpf: "222.222.222-22", nascimento: "2002-02-02"});
})();

export default sequelize;