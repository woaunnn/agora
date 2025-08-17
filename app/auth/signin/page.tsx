'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Box, IconButton, InputAdornment, Alert } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { AuthContainer, AuthCard, AuthCardContent } from '../../../styles/common/AuthCard'
import { StyledTextField, StyledButton, LinkButton } from '../../../styles/common/FormComponents'
import { SignInTitle, SignInForm, ForgotPasswordLink } from '../../../styles/signin/SignInStyles'
import { ClientAuthService } from '../../../lib/auth/client-auth'

const SignIn = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleClickShowPassword = () => setShowPassword(!showPassword)

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
    setLoading(true)
    setError('')

    try {
      const result = await ClientAuthService.signIn(formData.email, formData.password)
      
      if (result.success) {
        // ตรวจสอบ callback URL จาก query params
        const urlParams = new URLSearchParams(window.location.search)
        const callbackUrl = urlParams.get('callbackUrl') || '/dashboard'
        
        router.push(callbackUrl)
      } else {
        setError(result.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContainer>
      <AuthCard>
        <AuthCardContent>
          <SignInTitle>
            Login
          </SignInTitle>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <SignInForm onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              placeholder="user@example.com หรือ admin@example.com"
            />
            
            <StyledTextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
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

            {/* <ForgotPasswordLink>
              <LinkButton size="small" disabled={loading}>
                Forgot Password?
              </LinkButton>
            </ForgotPasswordLink> */}

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </StyledButton>
          </SignInForm>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
             <ForgotPasswordLink>
              <LinkButton size="small" disabled={loading}>
                Forgot Password?
              </LinkButton>
            </ForgotPasswordLink>
            <Link href="/auth/signup" passHref>
              <LinkButton disabled={loading}>
                {`Don't have an account? Sign Up`}
              </LinkButton>
            </Link>
          </Box>
        </AuthCardContent>
      </AuthCard>
    </AuthContainer>
  )
}

export default SignIn
