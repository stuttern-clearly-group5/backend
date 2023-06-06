import pkg from 'express';
const { NextFunction, Request, Response } = pkg;

export class BaseError extends Error {
  constructor(code, message) {
    super(message);

    // restore prototype chain since we are extending the built-in Error class
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends BaseError {
  constructor(message) {
    super(404, message);
    this.name = NotFoundError.name;
  }
}

export class ConflictError extends BaseError {
  constructor(message) {
    super(409, message);
    this.name = ConflictError.name;
  }
}

export class ForbiddenError extends BaseError {
  constructor(message) {
    super(403, message);
    this.name = ForbiddenError.name;
  }
}

export class BadRequest extends BaseError {
  constructor(errors) {
    super(400, 'Validation Error');
    this.name = BadRequest.name;
  }
}

export class InternalServerError extends BaseError {
  constructor(message) {
    super(500, message);
    this.name = InternalServerError.name;
  }
}

const errorHandler = (
  error,
  _req,
  res,
  _next
) => {
  let errors;

  if (error instanceof BadRequest) {
    errors = error.errors;
  }
   if(error.name === 'Error') {
    console.error(error)
    error = new InternalServerError('Something went wrong');
   } 

  res
    .status(error.code)
    .json({ status: 'fail', message: error.message, errors });
};

export default errorHandler;