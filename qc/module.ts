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

    // const whereClause: any = {};
    const arrClause: any = [];
    if (motorSerialNumber) {
      // whereClause.motorSerialNumber = motorSerialNumber;
      arrClause.push({
        motorSerialNumber,
      });
    }
    if (controllerSerialNumber) {
      // whereClause.controllerSerialNumber = controllerSerialNumber;
      arrClause.push({
        controllerSerialNumber,
      });
    }
    const QcFromDb = await QC.findOne({
      where: {
        [Op.or]: arrClause,
      },
    });

    if (QcFromDb) {
      throw new APIError("duplicate properties ", "DUPLICATE INPUTS");
    }

    let createdData;

    if (validatedData.imeiNo) {
      const dataFromDb = await QC.findOne({
        where: {
          [Op.or]: [{ imeiNo: validatedData.imeiNo }],
        },
      });
      if (!dataFromDb) {
        throw new APIError("invalid imei ", "  INVALID IMEI ");
      }

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

      createdData = await dataFromDb.save(validatedData);
    } else {
      createdData = await QC.create(validatedData);
    }
    const autogenerate_Value_fromDB = await Autogenerate_Value.findOne({
      where: {
        motorHp,
        headSize,
        motorCategory: motorCategory || "AC",
      },
    });

    autogenerate_Value_fromDB!.motorSerialNumber = motorSerialNumber;

    autogenerate_Value_fromDB!.controllerSerialNumber = controllerSerialNumber;
    await autogenerate_Value_fromDB?.save();

    const order = await Order.findOne({
      where: {
        id: orderId,
      },
    });

    console.log(order?.count, " is the count ");
    order!.count = order!.count - 1;
    console.log(order?.count, " has been changed ");
    await order?.save();

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

export async function downloadQcDetails(
  options: string,
  date1: string,
  date2: string
) {
  try {
    let startDate = new Date(`${date1}`); //YYYY-MM-DD
    let endDate = new Date(`${date2}`); //YYYY-MM-DD

    // console.log(startDate, endDate, " is the valiees ");
    startDate = new Date(startDate.setHours(0, 0, 0, 1));
    endDate = new Date(endDate.setHours(23, 59, 59, 59));

    if (options.toLowerCase() == "pmc") {
      const responseData = await QC.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      });
      return responseData;
    } else if (options.toLowerCase() == "c") {
      return await QC.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
          imeiNo: {
            [Op.not]: null as any,
          },
          rmsDeviceId: {
            [Op.is]: null as any,
          },
          motorCategory: {
            [Op.is]: null as any,
          },
          motorType: {
            [Op.is]: null as any,
          },
          motorSerialNumber: {
            [Op.is]: null as any,
          },
        },
      });
    } else {
      return await QC.findAll({
        where: {
          imeiNo: {
            [Op.is]: null as any,
          },
        },
      });
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
