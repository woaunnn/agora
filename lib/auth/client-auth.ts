export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'admin'
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

export class ClientAuthService {
  // สร้าง token (ในโปรเจ็กต์จริงควรใช้ JWT)
  static createToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 ชั่วโมง
    }
    
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }
  
  // ตรวจสอบ token
  static verifyToken(token: string): User | null {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString())
      
      // ตรวจสอบว่า token หมดอายุหรือไม่
      if (payload.exp < Date.now()) {
        return null
      }
      
      return {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role
      }
    } catch {
      return null
    }
  }
  
  // เข้าสู่ระบบ
  static async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    // ในโปรเจ็กต์จริงต้องเรียก API
    const mockUsers = [
      { id: '1', email: 'admin@example.com', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin' as const },
      { id: '2', email: 'user@example.com', password: 'user123', firstName: 'Test', lastName: 'User', role: 'user' as const }
    ]
    
    const user = mockUsers.find(u => u.email === email && u.password === password)
    
    if (!user) {
      return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user
    const token = this.createToken(userWithoutPassword)
    
    // เก็บ token ใน cookie
    document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=lax`
    document.cookie = `user-role=${userWithoutPassword.role}; path=/; max-age=${24 * 60 * 60}; secure; samesite=lax`
    
    return { success: true, user: userWithoutPassword, token }
  }
  
  // สมัครสมาชิก
  static async signUp(userData: { email: string; password: string; firstName: string; lastName: string }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    // ในโปรเจ็กต์จริงต้องเรียก API
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'user'
    }
    
    const token = this.createToken(newUser)
    
    // เก็บ token ใน cookie
    document.cookie = `auth-token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=lax`
    document.cookie = `user-role=${newUser.role}; path=/; max-age=${24 * 60 * 60}; secure; samesite=lax`
    
    return { success: true, user: newUser, token }
  }
  
  // ออกจากระบบ
  static signOut(): void {
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  }
  
  // ตรวจสอบสถานะการเข้าสู่ระบบ (client-side)
  static getCurrentUser(): AuthState {
    if (typeof document === 'undefined') {
      return { isAuthenticated: false, user: null }
    }
    
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    const token = cookies['auth-token']
    
    if (!token) {
      return { isAuthenticated: false, user: null }
    }
    
    const user = this.verifyToken(token)
    
    return {
      isAuthenticated: !!user,
      user
    }
  }
  
  // ตรวจสอบ token จาก cookie string (สำหรับ server-side)
  static verifyTokenFromCookies(cookieString: string): User | null {
    const cookies = cookieString.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    const token = cookies['auth-token']
    
    if (!token) {
      return null
    }
    
    return this.verifyToken(token)
  }
}
