
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 import { auth } from '@/auth'
export async function middleware(request: NextRequest) {
    const cookies = request.cookies;
    for(let c of cookies){
      console.log(c)
      if(c[0].includes('session-token')){
        return NextResponse.next()
      }
    }
    if (cookies.get('authjs.session-token') || cookies.get("__Secure-authjs.session-token")) {
        return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/login', request.nextUrl))
}
export const config = {
  matcher: '/logged/(.*)',
}