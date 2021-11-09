export interface IHttpRequestResponse {
  data: object | object[] | null;
  isError: boolean;
  responseStatus: boolean;
  responseTime: Date;
  message: string;
}

export interface IErrorResponse extends IHttpRequestResponse {
  errorCode: number;
}

export interface IResponseWithPagination extends IHttpRequestResponse {
  currentPage: number;
  limit: number;
  totalPages: number;
}
