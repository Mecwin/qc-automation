import { number, string } from "joi";

export type registerHP = {
  motorSerialNumber: string;
  motorHp: number;
  modelNumber: string;
  controllerSerialNumber: string;
  rmsDeviceId: string;
  headSize: number;
  motorCategory: string;
};

export type rmsDetails = {
  motorSerialNumber?: string;
  motorHp?: number;
  modelNumber?: string;
  controllerSerialNumber?: string;
  rmsDeviceId?: string;
  headSize?: number;
  motorCategory?: string;
};

export type embedRmsDetails = {
  distributorId: string;
  imeiNo: string;
  simPhoneNumber: string;
  simNumber: string;
  simOperator: string;
  networkType: string;
  rmsDeviceId: string;
};

export type OrderDetails = {
  orderNumber: string;
  count: number;
  status?: string;
};
