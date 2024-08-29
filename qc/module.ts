import { Op } from "sequelize";
import { rmsDetails } from "../types";
import APIError from "../utils/api-error";
import { QC } from "./model";
import { rmsDetailsAuth } from "./authenticate";
import { Autogenerate_Value } from "../autogenerate_value/model";
import { Order } from "../order/model";

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
    const createdData = await QC.create(validatedData);
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
    const rmsDetails = await QC.findOne({ where: { imeiNo } });
    if (!rmsDetails) {
      throw new APIError("invlaid IMEI number", "INVALID IMEI");
    }
    return rmsDetails;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
