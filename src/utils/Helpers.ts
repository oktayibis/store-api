import Joi from "joi";
import { IErrorResponse, IHttpRequestResponse } from "../Interfaces/IHttpRequestResponse";

export function SuccessResponse(data: any, message = "İşlem başırılı", code = 200): IHttpRequestResponse {

  if (data.password) {
    delete data.password;
  }
  return {
    data: data,
    isError: false,
    message,
    responseStatus: true,
    responseTime: new Date()
  };

}

export function ErrorResponse(error: Error, message = "Hatalı işlem", code = 500): IErrorResponse {
  return {
    data: error,
    errorCode: code,
    isError: true,
    message,
    responseStatus: true,
    responseTime: new Date()
  };
}

export function ErrorResponseWithMessage(message = "Hatalı işlem", code = 500): IErrorResponse {
  return {
    data: null,
    errorCode: code,
    isError: true,
    message,
    responseStatus: true,
    responseTime: new Date()
  };
}

export function ValidationErrorResponse(error: Joi.ValidationError, code = 400, message = "Hatalı ya da eksik bilgi gönderildi"): IErrorResponse {
  return {
    isError: true,
    data: { detailError: error.message, name: error.name },
    errorCode: code,
    message,
    responseStatus: true,
    responseTime: new Date()
  };
}

export function SuccessResponseWithCostumField(data: any, costum: object, message = "İşlem başırılı") {
  if (data.password) {
    delete data.password;
  }
  return {
    data: data,
    isError: false,
    message,
    responseStatus: true,
    responseTime: new Date(),
    ...costum
  };
}

export function calculateNetPrice(isDiscount: boolean, price: number, discountAmount: number): number {
  if (!isDiscount) {
    return price;
  }
  const percent = (100 - discountAmount) / 100;
  return price * percent;
}