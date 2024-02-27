// models/BaseModel.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/connections';

interface BaseModelAttributes {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
}

type BaseModelCreationAttributes = Optional<BaseModelAttributes, 'id'>;

class BaseModel extends Model<BaseModelAttributes, BaseModelCreationAttributes> {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

BaseModel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  timestamps: false, 
  tableName: 'base_model',
});
export { BaseModelAttributes }
export default BaseModel;
