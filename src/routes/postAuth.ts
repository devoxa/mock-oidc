import { Request, Response } from 'express'
import { z } from 'zod'
import { base64Encode } from '../helpers/base64'

type Redirect = void

const BodySchema = z.object({
  redirect_uri: z.string().url(),
  email: z.string().email(),
})

export function postAuth(request: Request, response: Response): Response | Redirect {
  const body = BodySchema.safeParse(request.body)

  if (!body.success) {
    return response.status(400).json({
      error: 'Error parsing request.body:\n' + JSON.stringify(body.error.issues),
    })
  }

  const code = base64Encode(`mock-oidc/code/${body.data.email}`)
  return response.redirect(`${body.data.redirect_uri}?code=${code}`)
}
