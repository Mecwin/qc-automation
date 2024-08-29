import { Op } from "sequelize";
import { registerHP, rmsDetails } from "../types";
import APIError from "../utils/api-error";
import { Autogenerate_Value } from "./model";
import { registerHPValidation } from "./validation";

export async function registerHP(data: registerHP) {
  try {
    const validatedData = await registerHPValidation.validateAsync(data);
    const {
      headSize,
      motorHp,
      rmsDeviceId,
      motorSerialNumber,
      controllerSerialNumber,
      modelNumber,
    } = validatedData;
    const autogenVal = await Autogenerate_Value.findOne({
      where: {
        [Op.or]: [
          { headSize },
          { motorHp },
          { rmsDeviceId },
          { motorSerialNumber },
          { controllerSerialNumber },
          { modelNumber },
        ],
      },
    });
    if (autogenVal) {
      throw new APIError(
        "hp or headsize or rmsDeviceId or motorSerialNumber or controllerSerialNumber or modelNumber  already registered  ",
        " DUPLICATE  INFO"
      );
    }
    const value = await Autogenerate_Value.create(validatedData);
    return {
      message: " details registered successfully ",
      data: value,
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function autogenerate(
  motorHp: number,
  headSize: number,
  motorCategory: string,
  options: string
) {
  try {
    if (motorHp && headSize && motorCategory && options) {
      const dataFromDb = await Autogenerate_Value.findOne({
        where: {
          motorHp,
          headSize,
          motorCategory,
        },
      });

      if (options.toLocaleLowerCase() == "controllerserialnumber") {
        const conSerialNum = dataFromDb?.controllerSerialNumber.slice(
          0,
          18
        ) as string;
        const conSerialNumCount = Number(
          dataFromDb?.controllerSerialNumber.split("-")[3]
        );

        dataFromDb!.controllerSerialNumber =
          conSerialNum + (conSerialNumCount + 1);
        console.log(conSerialNum, conSerialNumCount);
        return dataFromDb?.controllerSerialNumber;
      } else if (options.toLocaleLowerCase() == "motorserialnumber") {
        let [firstHalf, secondHalf] = dataFromDb?.motorSerialNumber.split(
          "-"
        ) as string[];
        secondHalf = Number(secondHalf) + 1 + "";
        firstHalf = firstHalf.slice(0, 7) + new Date().getFullYear();
        dataFromDb!.motorSerialNumber = firstHalf + "-" + secondHalf;
        return dataFromDb?.motorSerialNumber;
      } else if (options.toLocaleLowerCase() == "modelnumber") {
        return dataFromDb?.modelNumber;
      }
    } else
      throw new APIError(
        " motor HP or HeadSize or motorCategary or options is not provided",
        "MOTOR HP OR HEADSIZE OR MOTORCATEGARY OR OPTIONS  IS NOT PROVIDED"
      );
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
