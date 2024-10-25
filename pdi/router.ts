import { NextFunction, Response, Request } from "express";
import { Router } from "express";
import {
  embeded_Assign,
  generate_And_BlockModelNo_PumbSLNO_ControllerSL,
  GetAllPdiOrder,
  getDistributer,
  GetPdiOrderName,
  qc_assign,
} from "./module";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get(
  "/getAll-pdiOrders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = req.query.options;
      let Orders;
      if (options) {
        Orders = await GetAllPdiOrder(options);
      } else {
        Orders = await GetAllPdiOrder();
      }
      res.status(StatusCodes.OK).send(Orders);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/get-pdiorder/:orderid",
  async (req: Request, res: Response, next: NextFunction) => {
    const orderid = req.params.orderid;
    try {
      const Order = await GetPdiOrderName(orderid);
      console.log(Order);
      res.status(StatusCodes.OK).send(Order);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/block-pdi-orders",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        motor_hp,
        head_size,
        motor_category,
        controller_box_type,
        orderCount,
        orderId,
        motorType,
      } = req.body;
      const genereated = await generate_And_BlockModelNo_PumbSLNO_ControllerSL(
        motor_hp,
        head_size,
        motor_category,
        controller_box_type,
        orderCount,
        orderId,
        motorType
      );
      console.log(genereated);
      res.status(StatusCodes.OK).send(genereated);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/assign-rmsDeviceId",
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      const Order = await embeded_Assign(data);
      console.log(Order);
      res.status(StatusCodes.OK).send(Order);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/assign-qcdata",
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    try {
      const Order = await qc_assign(data);
      console.log(Order);
      res.status(StatusCodes.OK).send(Order);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/getPdi_Distributer/:pdiid",
  async (req: Request, res: Response, next: NextFunction) => {
    const { pdiid } = req.params;
    try {
      const distributor = await getDistributer(pdiid);
      res.status(StatusCodes.OK).send(distributor);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
