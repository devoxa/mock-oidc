import { NextFunction, Request, RequestHandler, Response } from 'express'

export function logMiddleware(): RequestHandler {
  return (request: Request, response: Response, next: NextFunction) => {
    const path = new URL(request.url, 'http://localhost').pathname

    response.on('finish', () => {
      console.log(`${request.method} ${path} ${response.statusCode}`)
    })

    next()
  }
}
