import {
  CreationOptional,
  DATE,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  UUID,
  UUIDV4,
} from "sequelize";
import Distributor from "../distributor/model";
import sequelize from "../database";

export class QC extends Model<
  InferAttributes<QC>,
  InferCreationAttributes<QC>
> {
  declare id: CreationOptional<string>;
  declare imeiNo: CreationOptional<string>;
  declare distributorId: ForeignKey<Distributor>;
  declare order: CreationOptional<string>;
  declare simPhoneNumber: CreationOptional<string>;
  declare simNumber: CreationOptional<string>;
  declare simOperator: CreationOptional<string>;
  declare controllerRequirement: CreationOptional<string>;
  declare headSize: CreationOptional<string>;
  declare controllerBoxType: CreationOptional<string>;
  declare rmsRequirement: CreationOptional<string>;
  declare state: CreationOptional<string>;
  declare controllerBoxColor: CreationOptional<string>;
  declare pumpType: CreationOptional<string>;
  declare motorSerialNumber: CreationOptional<string>;
  declare motorHp: CreationOptional<string>;
  declare motorType: CreationOptional<string>;
  declare modelNumber: CreationOptional<string>;
  declare nodalAgency: CreationOptional<string>;
  declare motorSize: CreationOptional<string>;
  declare controllerSerialNumber: CreationOptional<string>;
  declare rmsDeviceId: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

const qc_Schema = {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  imeiNo: {
    type: STRING,
  },
  distributorId: {
    type: UUID,
    references: {
      model: Distributor,
      as: "distributorId",
    },
  },
  order: {
    type: STRING,
  },
  simPhoneNumber: {
    type: STRING,
  },
  simNumber: {
    type: STRING,
  },
  simOperator: {
    type: STRING,
  },
  controllerRequirement: {
    type: STRING,
  },
  headSize: {
    type: STRING,
  },
  controllerBoxType: {
    type: STRING,
  },
  rmsRequirement: {
    type: STRING,
  },
  state: {
    type: STRING,
  },
  controllerBoxColor: {
    type: STRING,
  },
  pumpType: {
    type: STRING,
  },
  motorSerialNumber: {
    type: STRING,
  },
  motorHp: {
    type: STRING,
  },
  motorType: {
    type: STRING,
  },
  modelNumber: {
    type: STRING,
  },
  nodalAgency: {
    type: STRING,
  },
  motorSize: {
    type: STRING,
  },
  controllerSerialNumber: {
    type: STRING,
  },
  rmsDeviceId: {
    type: STRING,
  },
  createdAt: {
    type: DATE,
  },
  updatedAt: {
    type: DATE,
  },
};

QC.init(qc_Schema, { sequelize, tableName: "qc", modelName: "QC" });
