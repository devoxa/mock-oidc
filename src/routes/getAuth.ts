import { Request, Response } from 'express'
import { z } from 'zod'

const QuerySchema = z.object({
  client_id: z.string(),
  response_type: z.enum(['code']),
  redirect_uri: z.string().url(),
  scope: z
    .string()
    .transform((x) => x.split(' ').filter(Boolean))
    .pipe(z.array(z.string()).min(1)),
  access_type: z.enum(['offline']),
  prompt: z.enum(['consent']).optional(),
})

export function getAuth(request: Request, response: Response): Response {
  const query = QuerySchema.safeParse(request.query)

  if (!query.success) {
    return response.status(400).json({
      error: 'Error parsing request.query:\n' + JSON.stringify(query.error.issues),
    })
  }

  return response.send(`
<html>
  <head>
    <title>Mock OpenID Connect</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <form method="POST">
      <h1>Mock OpenID Connect</h1>

      <input type="hidden" name="redirect_uri" value="${query.data.redirect_uri}" />

      <p>
        <label for="email">Email:</label><br />
        <input type="email" id="email" name="email" required autofocus />
      </p>

      <input type="submit" id="submit" value="Sign in" />
    </form>
  </body>
</html>`)
}
