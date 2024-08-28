import {
  CreationOptional,
  DATE,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NUMBER,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import sequelize from "../database";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<string>;
  declare orderNumber: CreationOptional<string>;
  declare count: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

const orderSchema = {
  id: {
    type: UUID,
    defaultValues: UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: STRING,
    allowNull: false,
  },
  count: {
    type: NUMBER,
  },
  createdAt: {
    type: DATE,
  },
  updatedAt: {
    type: DATE,
  },
};

Order.init(orderSchema, {
  sequelize,
  timestamps: true,
  modelName: "Order",
  tableName: "order",
});
