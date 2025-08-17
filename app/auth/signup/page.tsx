'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Box, IconButton, InputAdornment, Alert } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { AuthContainer, AuthCard, AuthCardContent } from '../../../styles/common/AuthCard'
import { StyledTextField, StyledButton, LinkButton } from '../../../styles/common/FormComponents'
import { SignUpTitle, SignUpForm, TermsText, NameFieldsContainer } from '../../../styles/signup/SignUpStyles'
import { ClientAuthService } from '../../../lib/auth/client-auth'

const SignUp = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await ClientAuthService.signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      
      if (result.success) {
        router.push('/dashboard')
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการสมัครสมาชิก')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContainer>
      <AuthCard>
        <AuthCardContent>
          <SignUpTitle>
            สมัครสมาชิก
          </SignUpTitle>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <SignUpForm onSubmit={handleSubmit}>
            <NameFieldsContainer>
              <StyledTextField
                label="ชื่อ"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
              />
              <StyledTextField
                label="นามสกุล"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
              />
            </NameFieldsContainer>

            <StyledTextField
              fullWidth
              label="อีเมล"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
            />
            
            <StyledTextField
              fullWidth
              label="รหัสผ่าน"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              label="ยืนยันรหัสผ่าน"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TermsText>
              การสมัครสมาชิกแสดงว่าคุณยอมรับ <strong>ข้อกำหนดการใช้งาน</strong> และ <strong>นโยบายความเป็นส่วนตัว</strong> ของเรา
            </TermsText>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </StyledButton>
          </SignUpForm>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link href="/auth/signin" passHref>
              <LinkButton>
                มีบัญชีแล้ว? เข้าสู่ระบบ
              </LinkButton>
            </Link>
          </Box>
        </AuthCardContent>
      </AuthCard>
    </AuthContainer>
  )
}

export default SignUp
