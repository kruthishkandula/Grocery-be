import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { MESSAGE_TYPES, MESSAGE_TYPES_TYPE, STATUS_CODE, STATUS_CODES_TYPE, STATUS_TYPES, STATUS_TYPES_TYPE } from "./enums";

export const _sendResponse = ({
  req,
  res,
  statusCode,
  title,
  message,
  result = "",
}: {
  req: Request;
  res: Response;
  statusCode: STATUS_CODES_TYPE;
  title?: STATUS_TYPES_TYPE;
  message: MESSAGE_TYPES_TYPE;
  result?: any;
  responseType?: string;
}) => {
  try {
    return res.status(Number(statusCode)).json({
      status: STATUS_TYPES[title || "FAILURE"],
      message: MESSAGE_TYPES[message],
      result: result,
    });
  } catch (error) {
    console.log('error---', error)
    res.status(500).json({
      status: STATUS_TYPES.FAILURE,
      message: MESSAGE_TYPES.SOMETHING_WENT_WRONG,
      result: "",
    });
  }
};


export const generateJWTToken = (payload: any,) => {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRATION || "1d" });
}

export const verifyJWTToken = (token: string) => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export const decodeJWTToken = (token: string) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}