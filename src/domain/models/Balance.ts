import { DataTypes,Model, Optional } from "sequelize"
import sequelize from '../../config/connections';
import { Currency } from "../../enums/Currency";
import { BaseModelAttributes } from "./BaseModel";
import User from "./User";
interface BalanceAtribute extends BaseModelAttributes{
     id: number;
     amount: bigint;
     balance_type: string;
     currency:string;
        userId: number; 
}
interface BalanceCreationAtributes extends Optional<BalanceAtribute,"id">{}

class Balance extends Model<BalanceCreationAtributes,BalanceAtribute>{
    public id!: number;
    public amount!: bigint;
    public balance_type!:string;
    public currency!: string;
    public userId!: number; 
    public static associate() {
        Balance.belongsTo(User, { foreignKey: 'userId' }); 
      }

}

Balance.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:DataTypes.BIGINT,
        allowNull:true,
        unique:false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, 
        references: {
          model: 'users', 
          key: 'id',
        },
      },
 
    balance_type:{
        type:DataTypes.STRING,
        allowNull:true
    },
    currency:{
        type: DataTypes.ENUM(...Object.values(Currency)), 
        allowNull:true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
   
},
{
    sequelize,
    tableName: 'user_balance',
  })

export default Balance