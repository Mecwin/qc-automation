import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getAllOrderDetails, registerOrder } from "./module";
const route = Router();

route.post(
  "/register-order",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderData = req.body as any;
      res.status(StatusCodes.OK).send(await registerOrder(orderData));
    } catch (error) {
      next(error);
    }
  }
);

route.get(
  "/get-all-order-details",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(StatusCodes.OK).send(await getAllOrderDetails());
    } catch (error) {
      next(error);
    }
  }
);

export default route;
