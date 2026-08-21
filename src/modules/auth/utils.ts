import { cookies as getCookies } from 'next/headers'

interface Props {
  prefix: string
  value: string
}

export async function generateAuthCookie({ prefix, value }: Props) {
  const cookies = await getCookies()

  cookies.set({
    name: `${prefix}-token`,
    value: value,
    httpOnly: true,
    path: '/',
    // Cross-domain sharing is only valid outside development. On localhost
    // `SameSite=None` needs `Secure`, and `Domain` cannot carry a port.
    ...(process.env.NODE_ENV !== 'development' && {
      sameSite: 'none' as const,
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      secure: true,
    }),
  })
}
