import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuth = Boolean(accessToken);
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    const sessionResponse = await checkSession();

    if (sessionResponse?.data) {
      isAuth = true;

      const setCookieHeader = sessionResponse.headers['set-cookie'];

      if (setCookieHeader) {
        if (Array.isArray(setCookieHeader)) {
          setCookieHeader.forEach(cookie => {
            response.headers.append('set-cookie', cookie);
          });
        } else {
          response.headers.append('set-cookie', setCookieHeader);
        }
      }
    } else {
      isAuth = false;
    }
  }

  const isPrivateKey = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some(route => pathname.startsWith(route));

  if (isPrivateKey && !isAuth) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicKey && isAuth) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
