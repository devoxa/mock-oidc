import url from 'url'
import { NextFunction, Request, Response } from 'express'

export function logMiddleware() {
  return (request: Request, response: Response, next: NextFunction) => {
    const path = url.parse(request.url).pathname

    response.on('finish', () => {
      console.log(`${request.method} ${path} ${response.statusCode}`)
    })

    next()
  }
}
