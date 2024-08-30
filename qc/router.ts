import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { addRmsDetails, getRmsDetails } from "./module";
import { ensureQC } from "../utils/authentication";
const route = Router();
route.use(ensureQC);

route.post(
  "/add-rms-details",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as any;
      res.status(StatusCodes.OK).send(await addRmsDetails(data));
    } catch (error) {
      next(error);
    }
  }
);
route.get(
  "/get-rms-details/:imeiNo",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imeiNo } = req.params;
      res.status(StatusCodes.OK).send(await getRmsDetails(imeiNo));
    } catch (error) {
      next(error);
    }
  }
);

export default route;
