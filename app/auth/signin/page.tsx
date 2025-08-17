'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Box, IconButton, InputAdornment, Alert } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { AuthContainer, AuthCard, AuthCardContent } from '../../../styles/common/AuthCard'
import { StyledTextField, StyledButton, LinkButton } from '../../../styles/common/FormComponents'
import { SignInTitle, SignInForm, ForgotPasswordLink } from '../../../styles/signin/SignInStyles'
import { ClientAuthService } from '../../../lib/auth/client-auth'

// Schema สำหรับ validation
const signInSchema = yup.object().shape({
  email: yup
    .string()
    .required('กรุณากรอกอีเมล')
    .email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: yup
    .string()
    .required('กรุณากรอกรหัสผ่าน')
    .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
})

interface SignInFormData {
  email: string
  password: string
}

const SignIn = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true)
    setSubmitError('')

    try {
      const result = await ClientAuthService.signIn(data.email, data.password)
      
      if (result.success) {
        // ตรวจสอบ callback URL จาก query params
        const urlParams = new URLSearchParams(window.location.search)
        const callbackUrl = urlParams.get('callbackUrl') || '/dashboard'
        
        router.push(callbackUrl)
      } else {
        setSubmitError(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    } catch {
      setSubmitError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContainer>
      <AuthCard>
        <AuthCardContent>
          <SignInTitle>
            เข้าสู่ระบบ
          </SignInTitle>
          
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          
          <SignInForm onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  label="อีเมล"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                  placeholder="user@example.com หรือ admin@example.com"
                />
              )}
            />
            
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  fullWidth
                  label="รหัสผ่าน"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
                  placeholder="user123 หรือ admin123"
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
              )}
            />

            <ForgotPasswordLink>
              <LinkButton size="small" disabled={loading}>
                ลืมรหัสผ่าน?
              </LinkButton>
            </ForgotPasswordLink>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </StyledButton>
          </SignInForm>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link href="/auth/signup" passHref>
              <LinkButton disabled={loading}>
                ยังไม่มีบัญชี? สมัครสมาชิก
              </LinkButton>
            </Link>
          </Box>
        </AuthCardContent>
      </AuthCard>
    </AuthContainer>
  )
}

export default SignIn
