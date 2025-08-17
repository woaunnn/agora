# Auth System Documentation

## Overview
ระบบ authentication และ middleware สำหรับป้องกัน routes ที่สร้างขึ้นด้วย Next.js และ Material-UI

## Features
- ✅ หน้า Sign In และ Sign Up ที่ออกแบบด้วย Material-UI
- ✅ Middleware สำหรับป้องกัน protected routes
- ✅ ระบบ Role-based access control (User/Admin)
- ✅ การจัดการ cookies สำหรับ authentication
- ✅ การ redirect อัตโนมัติ

## File Structure
```
app/
├── auth/
│   ├── signin/page.tsx      # หน้าเข้าสู่ระบบ
│   └── signup/page.tsx      # หน้าสมัครสมาชิก
├── dashboard/page.tsx       # หน้า dashboard หลัก
└── admin/page.tsx          # หน้า admin (เฉพาะ admin)

lib/auth/
├── auth-service.ts         # Server-side auth utilities
└── client-auth.ts          # Client-side auth utilities

styles/
├── common/
│   ├── AuthCard.tsx        # Styled components สำหรับ auth cards
│   └── FormComponents.tsx  # Styled form components
├── signin/
│   └── SignInStyles.tsx    # Styles สำหรับหน้า signin
├── signup/
│   └── SignUpStyles.tsx    # Styles สำหรับหน้า signup
└── index.ts               # Export ทุก style components

middleware.ts              # Next.js middleware สำหรับป้องกัน routes
```

## Protected Routes
- `/dashboard` - ต้อง login
- `/admin` - ต้อง login และมี role admin
- `/profile` - ต้อง login
- `/settings` - ต้อง login

## Auth Routes (ไม่ให้เข้าถ้า login แล้ว)
- `/auth/signin`
- `/auth/signup`

## Test Accounts
### Admin Account
- Email: `admin@example.com`
- Password: `admin123`
- Role: admin

### User Account
- Email: `user@example.com`
- Password: `user123`
- Role: user

## How It Works

### 1. Middleware Protection
`middleware.ts` จะตรวจสอบทุก request:
- ตรวจสอบ auth token จาก cookies
- Redirect ไป signin ถ้าเข้า protected route โดยไม่ login
- Redirect ไป dashboard ถ้า login แล้วแต่พยายามเข้า auth pages
- ตรวจสอบ role สำหรับ admin routes

### 2. Client-Side Authentication
`ClientAuthService` จัดการ:
- การ login/logout
- การสร้างและตรวจสอบ token
- การจัดการ cookies
- การตรวจสอบสถานะ authentication

### 3. Style Organization
- `styles/common/` - Components ที่ใช้ร่วมกัน
- `styles/signin/` - Styles เฉพาะ signin
- `styles/signup/` - Styles เฉพาะ signup
- ใช้ Material-UI styled components

## Usage Examples

### Protected Component
```tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClientAuthService, User } from '../lib/auth/client-auth'

export default function ProtectedPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const authState = ClientAuthService.getCurrentUser()
    if (!authState.isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    setUser(authState.user)
  }, [router])

  if (!user) return <div>Loading...</div>

  return <div>Hello {user.firstName}!</div>
}
```

### Logout Function
```tsx
const handleLogout = () => {
  ClientAuthService.signOut()
  router.push('/auth/signin')
}
```

### Check User Role
```tsx
const authState = ClientAuthService.getCurrentUser()
if (authState.user?.role === 'admin') {
  // Show admin content
}
```

## Security Notes
⚠️ **สำหรับ Development เท่านั้น**
- ใช้ simple base64 encoding แทน JWT
- ไม่มีการตรวจสอบ signature
- Mock users แทนฐานข้อมูลจริง

สำหรับ Production ควร:
- ใช้ JWT library (เช่น `jsonwebtoken`)
- เชื่อมต่อกับฐานข้อมูลจริง
- เพิ่ม refresh token mechanism
- ใช้ HTTPS
- เพิ่มการตรวจสอบ rate limiting
