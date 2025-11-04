import z from 'zod'

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  username: z
    .string() // [username].shop.com --> domain
    .min(3, 'Username must be at lest 3 characters')
    .max(63, 'Username must be less than 63 characters')
    .regex(
      /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
      'Username can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.'
    )
    .refine(
      val => !val.includes('--'),
      'Username cannot contain consecutive hyphens.'
    )
    .transform(val => val.toLowerCase()),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
})
