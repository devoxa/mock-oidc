import { Request, Response } from 'express'
import { z } from 'zod'
import { base64Decode, base64Encode, base64Refine } from '../helpers/base64'

const TokenSchema = z
  .string()
  .refine(base64Refine)
  .transform(base64Decode)
  .pipe(z.string().startsWith('mock-oidc/token/'))

const HeadersSchema = z.object({
  authorization: z
    .string()
    .startsWith('Bearer ')
    .transform((x) => x.replace('Bearer ', ''))
    .pipe(TokenSchema),
})

export function getUserinfo(request: Request, response: Response) {
  const headers = HeadersSchema.safeParse(request.headers)

  if (!headers.success) {
    return response.status(400).json({
      error: 'Error parsing request.headers:\n' + JSON.stringify(headers.error.issues),
    })
  }

  const email = headers.data.authorization.replace('mock-oidc/token/', '')

  return response.json({
    sub: base64Encode(`mock-oidc/sub/${email}`),
    name: 'John Doe',
    email: email,
    email_verified: true,
  })
}
