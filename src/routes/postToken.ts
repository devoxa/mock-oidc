import { Request, Response } from 'express'
import { z } from 'zod'
import { base64Refine, base64Decode, base64Encode } from '../helpers/base64'

const CodeSchema = z
  .string()
  .refine(base64Refine)
  .transform(base64Decode)
  .pipe(z.string().startsWith('mock-oidc/code/'))

const BodySchema = z.object({
  client_id: z.string(),
  client_secret: z.string(),
  grant_type: z.enum(['authorization_code']),
  redirect_uri: z.string().url(),
  code: z.string().pipe(CodeSchema),
})

export function postToken(request: Request, response: Response): Response {
  const body = BodySchema.safeParse(request.body)

  if (!body.success) {
    return response.status(400).json({
      error: 'Error parsing request.body:\n' + JSON.stringify(body.error.issues),
    })
  }

  const email = body.data.code.replace('mock-oidc/code/', '')

  return response.json({
    access_token: base64Encode(`mock-oidc/token/${email}`),
  })
}
