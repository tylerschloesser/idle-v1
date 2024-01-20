import * as z from 'zod'

export const World = z.strictObject({
  id: z.string(),
})
