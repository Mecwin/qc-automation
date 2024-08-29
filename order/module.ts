import { Op } from "sequelize";
import { OrderDetails } from "../types";
import APIError from "../utils/api-error";
import { Order } from "./model";

export async function registerOrder(orderDetails: OrderDetails) {
  try {
    const orderFromDb = await Order.findOne({
      where: {
        orderNumber: orderDetails.orderNumber,
      },
    });
    if (orderFromDb) {
      throw new APIError("duplicate order number ", " DUPLICATE ORDER NUMBER ");
    }
    if (orderDetails.count == 0) {
      orderDetails.status = "COMPLETED";
    }

    const data = await Order.create(orderDetails);
    return {
      message: "successfully created order details ",
      data,
    };
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function getAllOrderDetails() {
  try {
    const orders = await Order.findAll({
      where: {
        count: { [Op.gt]: 0 },
        status: "ONGOING",
      },
    });
    if (orders.length > 0) {
      return orders;
    } else {
      return {
        message: "no orderId registered yet!!!",
      };
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}

export async function updateOrderDetails(orderId: string, count: number) {
  try {
    const orderFromDb = await Order.findOne({
      where: { orderNumber: orderId },
    });
    if (orderFromDb) {
      if (orderFromDb.status == "COMPLETED" && count > 0) {
        orderFromDb.status = "ONGOING";
        orderFromDb.count = count;
        const data = await orderFromDb.save();
        return {
          message: `count updated for this orderId ${orderId}`,
          data,
        };
      } else {
        return {
          message: " already count is 0  ",
        };
      }
    } else {
      return {
        message: " invalid order id ",
      };
    }
  } catch (error) {
    throw new APIError((error as APIError).message, (error as APIError).code);
  }
}
