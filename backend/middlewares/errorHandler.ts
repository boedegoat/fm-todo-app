import { ErrorRequestHandler } from 'express'
import { CustomError } from '../lib/error'

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    })
    return
  }
  res.status(500).json({
    status: 500,
    message: err.message || err || 'Something went wrong',
  })
}

export default errorHandler
