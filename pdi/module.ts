import { create } from "domain";
import Pdi from "./model";
import APIError from "../utils/api-error";
import { Order } from "../order/model";
import { extractMotorHpAndHeadSize, GeneratePdiName } from "./utils";
import { QC } from "../qc/model";
import { autogenerate } from "../autogenerate_value/module";
import { Autogenerate_Value } from "../autogenerate_value/model";
import { table } from "console";
import { embedPDIRmsDetails, qcpdidetails } from "../types";
import { Op, where } from "sequelize";
import { number } from "joi";
import app from "../app";

export async function GetAllPdiOrder(options?: any) {
  try {
    if (options === "qc") {
      const orders = await Order.findAll({
        where: {
          qcCount: {
            [Op.gt]: 0,
          },
          type: "PDI",
        },});
      return orders;}
    const orders = await Order.findAll({ where: { type: "PDI" } });
    return orders;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}


export async function GetPdiOrderName(orderId: string) {
  try {
    const pdiData = await Pdi.findAll({
      where: { orderId }, // Assuming `orderId` is the filter condition // Fetch both `pdi_Name` and `orderCount`
    });
    return pdiData;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function generate_And_BlockModelNo_PumbSLNO_ControllerSL(
  motor_hp: string,
  head_size: string,
  motor_category: string,
  controller_box_type: string,
  orderCount: number,
  orderId: string,
  motorType: string
) {
  try {
    const from_db = await Autogenerate_Value.findOne({
      where: {
        motorHp: Number(motor_hp),
        headSize: Number(head_size),
        motorCategory: motor_category,
      },
    });
    if (!from_db) {
      throw new APIError("Given Data is not Registerd", "400", 400);
    }
    const order = await Order.findOne({ where: { id: orderId } });
    if (order) {
      order.count += orderCount;
      order.embedCount += orderCount;
      await order.save();
    }
    const pdi_name = await GeneratePdiName(motor_hp, head_size, orderId);
    const pdiRecord = await Pdi.create({
      motor_hp: motor_hp,
      motor_category: motor_category,
      head_size: head_size,
      controller_box_type: controller_box_type,
      orderCount: orderCount,
      orderId: orderId,
      pdi_Name: pdi_name,
      embedCount: orderCount,
    });
    let generated_data = [];
    for (let i = 0; i < orderCount; i++) {
      let controllerserialnumber: any = await autogenerate(
        Number(motor_hp),
        Number(head_size),
        motor_category,
        "controllerserialnumber",
        motorType,
        controller_box_type
      );
      let modelNumber: any = await autogenerate(
        Number(motor_hp),
        Number(head_size),
        motor_category,
        "modelnumber",
        motorType,
        controller_box_type
      );
      let pumbslnumber: any = await autogenerate(
        Number(motor_hp),
        Number(head_size),
        motor_category,
        "motorserialnumber",
        motorType,
        controller_box_type
      );
      const { id } = pdiRecord;
      const Qc_data: any = await QC.create({
        motorHp: motor_hp,
        headSize: head_size,
        controllerBoxType: controller_box_type,
        controllerSerialNumber: controllerserialnumber,
        modelNumber: modelNumber,
        motorSerialNumber: pumbslnumber,
        orderId,
        motorCategory: motor_category,
        pdiId: id,
      });
      from_db.controllerSerialNumber = controllerserialnumber;
      from_db.modelNumber = modelNumber;
      from_db.motorSerialNumber = pumbslnumber;
      await from_db.save();
      generated_data.push(Qc_data);
    }
    return generated_data;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function embeded_Assign(data: embedPDIRmsDetails) {
  try {
    const { pdiId, orderId } = data;
    const pdiData = await Pdi.findByPk(pdiId);
    if (!pdiData) {
      throw new APIError("Pdi order is avilebele", "400", 400);
    }
    const qc: any = await QC.findOne({
      where: {
        pdiId,
        imeiNo: { [Op.is]: null },
      },
    });
    if (!qc) {
      throw new APIError("error finding qc ", "400", 400);
    }
    qc.imeiNo = data.imeiNo;
    qc.simNumber = data.simNumber;
    qc.distributorId = data.distributorId;
    qc.simOperator = data.simOperator;
    qc.simPhoneNumber = data.simPhoneNumber;
    qc.networkType = data.networkType;
    qc.rmsDeviceId = data.rmsDeviceId;
    await qc.save();
    const orders = await Order.findByPk(orderId);
    if (orders) {
      orders.qcCount += 1;
      orders.embedCount -= 1;
      await orders.save();
    }
    pdiData.embedCount -= 1;
    pdiData.qcCount += 1;
    await pdiData.save();
    return qc;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}


export async function qc_assign(data: qcpdidetails) {
  const { complitedCount, pdiId } = data;
  const Pdiorder = await Pdi.findByPk(pdiId)
  if(Pdiorder){
    if(complitedCount >Pdiorder.qcCount){
      throw new APIError("Completed count exceeds the allowed QC count." , "400" , 400)
    }

  }
  let datas: any = [];
  for (let i = 0; i < complitedCount; i++) {
    let qc = await QC.findOne({
      where: {
        pdiId,
        rmsDeviceId: { [Op.not]: null },
        state: { [Op.is]: null },
        controllerBoxColor: { [Op.is]: null },
        nodalAgency: { [Op.is]: null },
      },
    });
    if (qc) {
      qc.controllerRequirement = data.controllerRequirment;
      qc.state = data.state;
      qc.controllerBoxColor = data.controllerBoxcolor;
      qc.nodalAgency = data.nodelAgency;
      qc.product_set ="PMC"
      await qc.save();
      datas.push(qc);} 
    else
    {
      throw new APIError("qc data not found in this specified " , "400" , 400)
    }}
  return datas;}

export async function getDistributer(pdiId: string) {
  try {
    const distributor = await QC.findOne({
      where: { pdiId },
    });
    if (!distributor) {
      throw new APIError("Distributer Not Found", "404", 400);
    }
    return distributor;
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
