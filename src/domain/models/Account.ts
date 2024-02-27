// models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/connections';
import { BaseModelAttributes } from './BaseModel';
import User from './User';
interface AccountAttributes extends BaseModelAttributes{
    id: number;
    bankName: string;
    backCode: string;
    accountNumber: string;
    accountName: string;
    userId:number
  }
  
interface AccountCreationAttributes extends Optional<AccountAttributes, 'id'> {}
class Account extends Model<AccountCreationAttributes,AccountAttributes>  {
  public id!: number;
  public bankName!: string;
  public backCode!: string;  
  public accountNumber!: string;  
  public accountName!: string;  
  public userId!: number;  
  public static associate() {
    Account.belongsTo(User, { foreignKey: 'userId' }); 
  }

}

Account.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  backCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    unique: false,
  },
}, {
  sequelize,
  tableName: 'bank_account',
});

export default Account;
