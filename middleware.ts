import { NextRequest, NextResponse } from 'next/server'

// กำหนด routes ที่ต้องการ authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin'
]

// กำหนด routes ที่เป็น auth pages (ถ้า login แล้วไม่ควรเข้าได้)
const authRoutes = [
  '/auth/signin',
  '/auth/signup'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // ตรวจสอบ authentication token จาก cookie หรือ header
  const token = request.cookies.get('auth-token')?.value
  const isAuthenticated = !!token // ในโปรเจ็กต์จริงต้องตรวจสอบ token ให้ละเอียดกว่านี้
  
  // สร้าง response
  const response = NextResponse.next()
  
  // เพิ่ม security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // ตรวจสอบว่าเป็น protected route หรือไม่
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // ตรวจสอบว่าเป็น auth route หรือไม่
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // ถ้าเป็น protected route แต่ไม่ได้ login
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // ถ้า login แล้วแต่พยายามเข้า auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // สำหรับ admin routes (ตัวอย่างการตรวจสอบ role)
  if (pathname.startsWith('/admin')) {
    const userRole = request.cookies.get('user-role')?.value
    
    if (!isAuthenticated) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
