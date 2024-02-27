// models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/connections';
import  { BaseModelAttributes } from './BaseModel';
import Account from './Account';
import Balance from './Balance';
import { UserRole } from '../../enums/UserRole';

interface UserAttributes extends BaseModelAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  status?: boolean;
  referer_link?: string;
  expired:Date; 
  otp:number;

  role: UserRole;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public status!: boolean;
  public role!: UserRole;
  public expired!:Date; 
  public otp!:number; 
  public referer_link!:string;
  public createdAt!:Date


  public static associate() {
    User.hasOne(Account, { foreignKey: 'userId' });
    User.hasOne(Balance, { foreignKey: 'userId' });
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  otp: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  referer_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,

  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  expired: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(UserRole)), 
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'users',
});

export { UserAttributes, UserCreationAttributes };
export default User;
