import { Op } from "sequelize";
import { rmsDetails } from "../types";
import APIError from "../utils/api-error";
import { QC } from "./model";
import { rmsDetailsAuth } from "./authenticate";
import { Autogenerate_Value } from "../autogenerate_value/model";
import { Order } from "../order/model";
import Distributor from "../distributor/model";

export async function addRmsDetails(rmsDetails: rmsDetails) {
  try {
    const validatedData = await rmsDetailsAuth.validateAsync(rmsDetails);
    const {
      motorSerialNumber,
      motorHp,
      modelNumber,
      controllerSerialNumber,
      rmsDeviceId,
      headSize,
      motorCategory,
      orderId,
    } = validatedData;

    const QcFromDb = await QC.findOne({
      where: {
        [Op.or]: [{ motorSerialNumber }, { controllerSerialNumber }],
      },
    });

    if (QcFromDb) {
      throw new APIError("duplicate properties ", "DUPLICATE INPUTS");
    }

    const dataFromDb = await QC.findOne({
      where: {
        [Op.or]: [{ imeiNo: validatedData.imeiNo }],
      },
    });
    if (!dataFromDb) {
      throw new APIError("invalid imei ", "  INVALID IMEI ");
    }

    const autogenerate_Value_fromDB = await Autogenerate_Value.findOne({
      where: {
        motorHp,
        headSize,
        motorCategory,
      },
    });

    autogenerate_Value_fromDB!.motorSerialNumber = motorSerialNumber;

    autogenerate_Value_fromDB!.controllerSerialNumber = controllerSerialNumber;
    await autogenerate_Value_fromDB?.save();

    dataFromDb.controllerSerialNumber = validatedData.controllerSerialNumber;
    dataFromDb.motorSerialNumber = validatedData.motorSerialNumber;
    dataFromDb.rmsDeviceId = validatedData.rmsDeviceId;
    dataFromDb.modelNumber = validatedData.modelNumber;
    dataFromDb.distributorId = validatedData.distributorId;

    dataFromDb.simOperator = validatedData.simOperator;

    dataFromDb.controllerRequirement = validatedData.controllerRequirement;

    dataFromDb.headSize = validatedData.headSize;

    dataFromDb.controllerBoxType = validatedData.controllerBoxType;

    dataFromDb.rmsRequirement = validatedData.rmsRequirement;

    dataFromDb.state = validatedData.state;

    dataFromDb.controllerBoxColor = validatedData.controllerBoxColor;

    dataFromDb.pumpType = validatedData.pumpType;

    dataFromDb.motorHp = validatedData.motorHp;

    dataFromDb.motorType = validatedData.motorType;

    dataFromDb.nodalAgency = validatedData.nodalAgency;

    dataFromDb.motorSize = validatedData.motorSize;

    dataFromDb.simNumber = validatedData.simNumber;

    dataFromDb.simPhoneNumber = validatedData.simPhoneNumber;

    dataFromDb.motorCategory = validatedData.motorCategory;

    dataFromDb.networkType = validatedData.networkType;
    dataFromDb.orderId = validatedData.orderId;

    const createdData = await dataFromDb.save(validatedData);
    if (createdData) {
      const order = await Order.findOne({
        where: {
          id: orderId,
        },
      });
      order!.count = order!.count - 1;
      await order?.save();
    }

    return {
      message: "Successfully created RMS Details",
      data: {
        createdData,
      },
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getRmsDetails(imeiNo: string) {
  try {
    const rmsDetails = await QC.findOne({
      include: {
        model: Distributor,
        as: "distributor",
        attributes: ["businessName", "id"],
      },
      where: { imeiNo },
    });

    if (!rmsDetails) {
      throw new APIError("invlaid IMEI number", "INVALID IMEI");
    }
    return rmsDetails;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
