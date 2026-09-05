class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  additional_info: Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    additional_info: Record<string, unknown> = {},
    isOperational = true,
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.additional_info = additional_info;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
