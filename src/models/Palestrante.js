import { DataTypes, Model } from "sequelize";

class Palestrante extends Model{
    static init(sequelize){
        super.init({
            nome: {
                type: DataTypes.STRING
                
            }
        })
    }
}

export { Palestrante}