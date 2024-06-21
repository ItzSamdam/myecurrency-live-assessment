interface IErrorMessage {
  statusCode: number;
  status?: string;
  message: string;
  field?: any;
}

export default IErrorMessage;
