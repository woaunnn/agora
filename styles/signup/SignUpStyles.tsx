'use client'

import { Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const SignUpTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  fontWeight: 700,
  fontSize: '28px',
  color: '#333',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}))

export const SignUpForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

export const TermsText = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  color: '#666',
  textAlign: 'center',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
  lineHeight: 1.5,
}))

export const NameFieldsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  '& > *': {
    flex: 1,
  },
}))
