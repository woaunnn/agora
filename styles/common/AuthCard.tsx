'use client'

import { Card, CardContent, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const AuthCard = styled(Card)(() => ({
  maxWidth: 500,
  width: '100%',
  margin: '0 auto',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}))

export const AuthCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
  '&:last-child': {
    paddingBottom: theme.spacing(4),
  },
}))

export const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}))
